require('babel/register');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk     = require('chalk');

const webpackConfig = require('./webpack/development_hot');
const config = require('../config');

const paths = config.get('utils_paths');
const server = new WebpackDevServer(webpack(webpackConfig), {
  contentBase : paths.project(config.get('dir_src')),
  hot    : true,
  quiet  : false,
  noInfo : false,
  lazy   : false,
  stats  : {
    colors : true
  },
  historyApiFallback : true
});

const host = config.get('webpack_host');
const port = config.get('webpack_port');
server.listen(port, host, function () {
  console.log(chalk.green(
    `webpack-dev-server is now running at ${host}:${port}.`
  ));
});
