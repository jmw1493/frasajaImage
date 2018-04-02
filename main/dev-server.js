const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

const config = require("./webpack.config.js");
const options = {
  contentBase: './build',
  hot: true,
  host: 'localhost'
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(8080, 'localhost', () => {
  console.log('dev server listening on port 8080')
})
