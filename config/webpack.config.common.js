const path = require('path')
const user = require('../scripts/utils/format-config')(require('./main.config.js'))

const CSSLoaders = [
  {
    loader: 'css-loader',
    options: {
      url: !!(user.appEnv === 'development'),
      sourceMap: true,
      minimize: !!(user.appEnv === 'production')
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      config: { path: path.resolve(__dirname, 'postcss.config.js') },
      sourceMap: true
    }
  }
]

if (user.css.preprocessorLoader) {
  CSSLoaders.push(
    {
      loader: user.css.preprocessorLoader,
      options: {
        sourceMap: true
      }
    }
  )
}

const webpack = {
  output: {
    publicPath: user.paths.basepath,
    // we bundle from the www folder to avoid messing with the webpack dev middleware
    // all entries src/dest path are converted through scripts/utils/format-config.js
    path: user.paths.www,
    filename: '[name]',
    chunkFilename: '[name].[id].chunk.js'
  },
  resolve: {
    alias: user.aliases
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: []
}

module.exports = { CSSLoaders, webpack, user }
