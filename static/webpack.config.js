//const autoprefixer = require('autoprefixer');
const path = require('path');
//const webpack = require('webpack');

module.exports = {
  entry: './app.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
//      { test: /\.css/, loader: 'style-loader!css-loader!postcss-loader' },
//      { test: /\.json/, loader: 'json-loader' },
      { test: /\.html/, use: 'ractive-component-loader' }
    ]
  }
};