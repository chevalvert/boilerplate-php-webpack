const startTime = new Date()

const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.prod')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const user = require('./utils/format-config')(require('../config/main.config.js'))

const sh = require('kool-shell/namespaced')('__kirbywebpack')

const compiler = webpack(webpackConfig)

new ProgressBarPlugin({
  format: sh.colors.gray('build [:bar] :percent'),
  clear: true,
  summary: false
}).apply(compiler)

Promise.resolve()
  .then(() => fs.remove(path.join(user.paths.assets, 'builds')))
  .then(() => sh.log('Running the webpack compiler...'))
  .then(
    () =>
      new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) reject(err)
          else if (stats.hasErrors()) {
            webpackErrorMessage()
            if (stats.compilation) {
              if (stats.compilation.errors) stats.compilation.errors.map(sh.error)

              if (stats.compilation.children) {
                stats.compilation.children.map(child => {
                  const childStats = child.getStats()
                  if (childStats.compilation) {
                    if (childStats.compilation.errors) childStats.compilation.errors.map(sh.error)
                    if (childStats.compilation.warnings) childStats.compilation.warnings.map(sh.warn)
                  }
                })
              }
            }

            sh.exit(0)
          }
          else if (stats.hasWarnings()) {
            sh.log('Warnings during the webpack compilation')
            if (stats.compilation) {
              if (stats.compilation.warnings) stats.compilation.warnings.map(sh.warn)

              if (stats.compilation.children) {
                stats.compilation.children.map(child => {
                  const childStats = child.getStats()

                  if (childStats.compilation && childStats.compilation.warnings) {
                    childStats.compilation.warnings.map(sh.warn)
                  }
                });
              }
            }
          }

          resolve(stats)
        })
      })
  )
  .catch(err => {
    webpackError(err)
  })
  .then(() => {
    const elapsedTime = ((new Date() - startTime) / 1000).toFixed(3)
    sh.log()
    sh.success(`Build completed in ${elapsedTime}s !\n`)
    sh.exit(0)
  })


function webpackErrorMessage() {
  sh.error('Error during the webpack compilation')
}

function webpackError (err) {
  webpackErrorMessage();
  sh.error(err)
  sh.exit(0)
}
