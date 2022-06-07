const postcss = require('postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const fs = require('fs')
const path = require('path')

const cssInput = path.join(__dirname, '../public/styles/style.css')
const cssOutput = path.join(__dirname, '../public/styles/style.min.css')

// CSS minifier
fs.readFile(cssInput, (err, buffer) => {
  postcss([autoprefixer, cssnano])
    .process(buffer, {
      from: cssInput,
      to: cssOutput,
    })
    .then((result) => {
      fs.writeFile(cssOutput, result.css, () => true)
    })
})
