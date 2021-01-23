const path = require("path");

const baseConfig = (mode) => {
  return {
    entry: {
      index: "./src/index.ts",
      docs: "./src/docs.ts",
    },
    mode,
    devtool: "source-map",
    devServer: {
      publicPath: "/dist/",
      compress: true,
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
  const var_es2017 = {
    ...baseConfig(mode),
    output: {
      filename: "[name]-var-es2017." + ext,
      path: path.join(__dirname, "dist"),
      libraryTarget: "var",
      library: "MonacoEditorCodeReview",
    },
  };

  const common_es2017 = {
    ...baseConfig(mode),
    output: {
      filename: "[name]-commonjs-es2017." + ext,
      path: path.join(__dirname, "dist"),
    },
  };
  return [var_es2017, common_es2017];
}

module.exports = () => {
  // if (WEBPACK_SERVE) {
    return getConfigs("development")[1];
  // } else {
  //   return getConfigs("development").concat(getConfigs("production"));
  // }
};
