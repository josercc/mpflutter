const fs = require('fs')
const {execSync} = require('child_process')

let baseCode = fs.readFileSync('./dist/miniprogram-element/base.js', {encoding: 'utf-8'})
baseCode = baseCode.replace(/require\("miniprogram-render"\)/g, 'require("../miniprogram-render/index")')
fs.writeFileSync('./dist/miniprogram-element/base.js', baseCode)

// Copy to dist_weapp and sample_weapp
execSync('rm -rf ../mp_dom_runtime/dist_weapp/kbone')
execSync('cp -rf ./dist ../mp_dom_runtime/dist_weapp/kbone')
execSync('rm -rf ../mp_dom_runtime/sample_weapp/kbone')
execSync('cp -rf ./dist ../mp_dom_runtime/sample_weapp/kbone')