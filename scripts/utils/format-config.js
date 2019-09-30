const path = require('path')
const sh = require('kool-shell/namespaced')('__kirbywebpack')

let cached = null

function formatConfig (config) {
  if (cached) return cached

  // format entries for webpack
  const nEntries = {}
  const projectRoot = path.join(__dirname, '..', '..')
  for (let k in config.entries) {
    const relativeWww = path.relative(projectRoot, config.paths.www)
    const src = path.join(projectRoot, k)
    const dist = path.relative(relativeWww, config.entries[k])
    if (
      dist.length >= 2 &&
      dist.substr(0, 2) === '..' &&
      config.appEnv === 'development'
    ) {
      sh.log()
      sh.warn(
        '\n' + k + ' will not be bundled in development.\n' +
        'Its destination is outside the public folder.'
      )
      continue
    }

    if (!nEntries[dist]) {
      nEntries[dist] = (config.appEnv === 'development')
        ? [src, 'webpack-hot-middleware/client?reload=true']
        : src
    } else if (Array.isArray(nEntries[dist])) {
      nEntries[dist].unshift(src)
    } else if (typeof nEntries[dist] === 'string') {
      nEntries[dist] = [src, nEntries[dist]]
    }
  }

  config.entries = nEntries

  // add preprocessor loader and ext
  config.css = {
    preprocessorLoader: 'sass-loader',
    sourceExt: 'scss',
    sourceRegexExt: new RegExp('\\.(scss)$')
  }

  cached = config
  return cached
}

module.exports = formatConfig
