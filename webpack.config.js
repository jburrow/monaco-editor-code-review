const path = require("path");

const baseConfig = (mode, target) => {
  return {
    entry: {
      index: "./src/index.ts",
      docs: "./src/docs.ts",
    },
    mode,
    devtool: "source-map",
    devServer: {
      publicPath: "/dist/",
      compress:true,
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
              target,
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
  const var_es2017 = {
    ...baseConfig(mode, "es2017"),
    output: {
      filename: "[name]-var-es2017." + ext,
      path: path.join(__dirname, "dist"),
      libraryTarget: "var",
      library: "MonacoEditorCodeReview",
    },
    plugins: [

    ],
  };

  const common_es5 = {
    ...baseConfig(mode, "es5"),
    output: {
      filename: "[name]-commonjs-es5." + ext,
      path: path.join(__dirname, "dist"),
    },
  };

  const common_es2017 = {
    ...baseConfig(mode, "es2017"),
    output: {
      filename: "[name]-commonjs-es2017." + ext,
      path: path.join(__dirname, "dist"),
    },
  };
  return [var_es2017, common_es5, common_es2017];
}

module.exports = ({ WEBPACK_SERVE }) => {
  if (WEBPACK_SERVE) {
    return getConfigs("development")[0];
  } else {
    return getConfigs("development").concat(getConfigs("production"));
  }
};
