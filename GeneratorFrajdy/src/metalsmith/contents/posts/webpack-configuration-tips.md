---
id: 1503347705094
title: Webpack configuration tips
description: Quick how tos list with brief informations on achieving certain webpack behaviour
collection: posts
author: kernelpanic
date: 2017-08-16
layout: post.html
---
## How to get scss variables inside js code?
Install ScssToJson
```bash
npm install scss-to-json --save-dev
```
Import scss-to-json
```js
let scssToJson = require('scss-to-json');
```
Provide scss object in externals
```js
externals: {
  scss: JSON.stringify(scssToJson(scssVariablesPath))
}
```
Use it like a module:
```js
import scss from 'scss';

console.log(scss['$color-black']); // #000
```

## How to get jQuery exposed for other libs?
Install jQuery
```bash
npm install jquery --save
```
Use ProvidePlugin plugin for webpack.
```js
plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
]
```

For providing jquery from local project file see note in the next tip.


## How to make imports relative to sources root?

Use alias configuration
```js
  resolve: {
      alias: {
          sources: path.resolve(
              './src'
          )
      }
  }
```
Later on you can use following import path
```js
import component from 'soruces/js/component';
```
Note that it is possible to use aliases in webpack config too. For example in
ProvidePlugin:
```js
plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: 'sources/js/vendors/popper.js'
    })
]
```

## How to use babel for code transpilation?
Install needed loaders, presets and plugins
```bash
npm install --save-dev babel-loader babel-core babel-preset-env babel-plugin-syntax-dynamic-import babel-plugin-transform-runtime
```
Config loader as follows
```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components|js\/vendors)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [[
            'env',
            {
                targets: {
                    browsers: ['last 2 versions', 'ie >= 10', 'safari >= 9']
                },
                useBuiltIns: true,
                debug: true
            }
          ]],
          plugins: [
              'syntax-dynamic-import',
              'transform-runtime'
          ],
          cacheDirectory: true
        }
      }
    }
  ]
}
```
* The *test* option provides regexp which filter imports by import path
* The *exclude* option filters node_modules or bower_components as so vendors
are not processed (in npm still ES5 modules are standard)
* The *loader* tells webpack which loader is going to be used
* The *options* are passed to the loader
* The presets env option selects babel-preset-env
* The presets targets option bakes polyfills for specific browser versions
* The presets useBuiltIns option replaces import "babel-polyfill"; with individual requires for babel-polyfill based on environment
* The plugins syntax-dynamic-import provides dynamic import syntax with magic comments
* The plugins transform-runtime reduces polyfills bloat (here is why https://babeljs.io/docs/plugins/transform-runtime/)
* The cacheDirectory option tells babel to cache builds

Using debug: true provides full list of used transformations and polyfills.
