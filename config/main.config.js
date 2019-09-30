const path = require('path')
const pckg = require('../package.json')

const ROOT = path.join(__dirname, '..')

const paths = {
  root: ROOT,
  src: path.join(ROOT, 'src'),
  www: path.join(ROOT, 'www'),
  assets: path.join(ROOT, 'www/assets'),

  // public baseUrl of your site, generally '/'.
  // it often changes depending on your environment,
  // the correct one will be chosen from the value of appEnv.
  basepaths: {
    development: '/',
    preprod: '/',
    production: '/'
  }
}

const entries = {
  'src/index.js': path.join(paths.assets, 'bundle.js'),
  'src/index.scss': path.join(paths.assets, 'bundle.css')
}

const aliases = {}
if (pckg.aliases) {
  Object.entries(pckg.aliases).forEach(([aliasName, aliasPath]) => {
    aliases[aliasName] = path.resolve(__dirname, '../' + aliasPath)
  })
}

const devServer = {
  // Port used by the dev server
  port: 8080,

  // Use this option if you already have a local environment (like MAMP)
  // e.g. proxy: website.dev
  // don't forget to rename config.localhost.php if you use a vhost
  proxy: false,

  // Set to true if you need a devServer in https
  https: false,

  // The alias/path to the php binary. OSX has PHP available natively.
  // You have to edit this to have the devServer working on Windows.
  // Use the proxy opt if you can't use / don't want to use a built-in php serv.
  phpBinary: 'php',

  // Set this to true to display PHP logs in your terminal
  // /!\ does nothing if you use the `proxy` option
  logPhpErrors: true,

  // Force browserSync to not watch some specific files/folder
  ignored: []
}

// the appEnv variable can be used to create environment-specific behaviours
// By default, appEnv can be one of those three values:
//   - development (via npm run start)
//   - production (via npm run build or npm run stats)
const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development'

// appEnv is used to choose the correct basepath from paths.basepaths
paths.basepath = paths.basepaths[appEnv] || paths.basepaths.development

module.exports = { paths, aliases, entries, devServer, appEnv }
