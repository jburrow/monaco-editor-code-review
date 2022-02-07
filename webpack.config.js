const path = require("path");

const baseConfig = (mode) => {
  return {
    mode,
    devtool: "source-map",
    output: {
      //Replaced when expanding
    },
    devServer: {
      client: {
        overlay: true,
        logging: "log",
        progress: true,
      },
      static: {
        directory: path.join(__dirname),
      },
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          loader: "ts-loader",
          options: {
            experimentalWatchApi: true,
            compilerOptions: {
              target: "es2017",
            },
          },
        },
      ],
    },
    externals: {
      "monaco-editor": "monaco",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
  };
};

function getConfigs(mode) {
  const ext = mode === "production" ? "min.js" : "js";

  output = {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist",
  };
  const var_es2017 = {
    ...baseConfig(mode),
    output: {
      filename: "[name]-var-es2017." + ext,
      libraryTarget: "var",
      library: "MonacoEditorCodeReview",
      ...output,
    },
    entry: {
      index: "./src/index.ts",
    },
  };

  const common_es2017 = {
    ...baseConfig(mode),
    output: {
      filename: "[name]-commonjs-es2017." + ext,
      ...output,
    },
    entry: {
      docs: "./src/docs.ts",
    },
  };
  return [var_es2017, common_es2017];
}

module.exports = (env, argv) => {
  if (argv.env.WEBPACK_SERVE) {
    return getConfigs("development")[1];
  } else {
    return getConfigs("development").concat([getConfigs("production")[0]]);
  }
};
