'use strict'

process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const inquirer = require('inquirer')
const detect = require('detect-port')
const opn = require('opn')
const paths = require('../config/paths')
const config = require('../config/webpack.config.dev')

const DEFAULT_PORT = process.env.PORT || 8080

function setupCompiler(webpackConfig) {
  const compiler = webpack(webpackConfig)

  return compiler
}

function runDevServer(port) {
  const compiler = setupCompiler(config)
  const devServer = new WebpackDevServer(compiler, {
    contentBase: paths.clientDir,
    publicPath: config.output.publicPath,
    hot: true,
    quiet: true,
    historyApiFallback: true
  })

  devServer.listen(port)
}

function start() {
  detect(DEFAULT_PORT)
    .then((port) => {
      if (port === DEFAULT_PORT) return port
      return inquirer
        .prompt([{
          type: 'confirm',
          name: 'shouldChangePort',
          message: [
            `Port ${DEFAULT_PORT} is already in use.`,
            'Use another port?'
          ].join('\n')
        }])
        .then((answers) => {
          if (answers.shouldChangePort) return port
        })
    })
    .then((port) => {
      if (!port) return
      opn(`http://localhost:${port}`)
      runDevServer(port)
    })
}

module.exports = start
