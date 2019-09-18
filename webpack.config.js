const path = require("path");
const TimestampWebpackPlugin = require("timestamp-webpack-plugin");

module.exports = {
  entry: { index: "./src/index.ts", docs: "./src/docs.ts" },
  mode: "development",
  devtool: "source-map",
  devServer: {
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  externals:{
    "monaco-editor":"monaco"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
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
