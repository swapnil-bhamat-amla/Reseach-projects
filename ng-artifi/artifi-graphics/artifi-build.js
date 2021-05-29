const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files = [
        './dist/graphics-component/runtime.js',
        './dist/graphics-component/polyfills.js',
        './dist/graphics-component/scripts.js',
        './dist/graphics-component/main.js',
    ]
    await fs.ensureDir('elements')
    await concat(files, 'elements/framework-poll.js');
    await fs.copyFile('./dist/graphics-component/styles.css', 'elements/styles.css')

})()
