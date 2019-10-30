const path = require("path");
const TimestampWebpackPlugin = require("timestamp-webpack-plugin");

const baseConfig = (mode, target) => {
  return {
    entry: { index: "./src/index.ts", docs: "./src/docs.ts" },
    mode,
    devtool: "none",
    devServer: {
      publicPath: "/dist/"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,

          exclude: [/node_modules/],
          loader: "ts-loader",
          options: {
            experimentalWatchApi: true,
            compilerOptions: {
              target
            }
          }
        }
      ]
    },
    externals: {
      "monaco-editor": "monaco"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
      pathinfo: false
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    }
  };
};

function getConfigs(mode) {
  const ext = mode === 'production'?'js':'min.js';
  const var_es2017 = {
    ...baseConfig(mode, "es2017"),
    output: {
      filename: "[name]-var-es2017." + ext,
      path: path.join(__dirname, "dist"),
      libraryTarget: "var",
      library: "MonacoEditorCodeReview"
    },
    plugins: [
      new TimestampWebpackPlugin({
        path: path.join(__dirname, "dist"),
        filename: "timestamp.json"
      })
    ]
  };

  const common_es5 = {
    ...baseConfig(mode, "es5"),
    output: {
      filename: "[name]-commonjs-es5." + ext,
      path: path.join(__dirname, "dist")
    }
  };

  const common_es2017 = {
    ...baseConfig(mode, "es2017"),
    output: {
      filename: "[name]-commonjs-es2017." + ext,
      path: path.join(__dirname, "dist")
    }
  };
  return [var_es2017, common_es5, common_es2017];
}

module.exports = (env, argv) => {
  console.log(argv);
  console.log(env);
  if (!argv.mode || argv.mode === "development") {
    return [baseConfig("development", "es2019")];
  } else {
    return getConfigs("development").concat( getConfigs("production"));
  }
};
