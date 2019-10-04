const path = require("path");
const TimestampWebpackPlugin = require("timestamp-webpack-plugin");

const baseConfig = target => {
  return {
    entry: { index: "./src/index.ts", docs: "./src/docs.ts" },
    mode: "development",
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

const libes2017 = {
  ...baseConfig("es2017"),
  output: {
    filename: "[name].js",
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

const es5 = {
  ...baseConfig("es5"),
  output: {
    filename: "[name]-commonjs-es5.js",
    path: path.join(__dirname, "dist")
  }
};

const es2017 = {
  ...baseConfig("es2017"),
  output: {
    filename: "[name]-commonjs-es2017.js",
    path: path.join(__dirname, "dist")
  }
};

module.exports = [libes2017, es5, es2017];
