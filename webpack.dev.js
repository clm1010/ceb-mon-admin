const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 8081,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: {
      // "/api0": {
      //     target: 'http://10.200.142.87:9200/',
      //     pathRewrite: {
      //         "^/api0": ""
      //     },
      //     changeOring: true
      // },
      "/api0": {
        target: "http://localhost:9200/",
        pathRewrite: {
          "^/api0": "",
        },
        changeOring: true,
      },
      "/datainsight": {
        target: "http://10.1.180.56:80",
        changeOring: true,
      },
      "/cpaas": {
        target: "http://cpaas.td.io",
        pathRewrite: {
          "^/cpaas": "",
        },
        changeOring: true,
      },
    },
  },
});
