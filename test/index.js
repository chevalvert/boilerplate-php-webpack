const fs = require('fs')
const util = require('util')
const glob = require('fast-glob')
const test = require('ava')

const { paths } = require('../config/main.config.js')

test('no DEBUG annotation', async t => {
  const read = util.promisify(fs.readFile)
  const files = await glob(['**/*.js', '**/*.scss'], {
    cwd: paths.src,
    absolute: true
  })

  await Promise.all(files.map(async file => {
    const content = await read(file, 'utf-8') || ''
    content.split('\n').forEach((line, index) => {
      if (line.includes('// DEBUG')) t.fail(file + ':' + (index + 1))
    })
  }))

  t.pass()
})
