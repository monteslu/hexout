const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    hexout: path.join(__dirname, './src/game.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './build/')
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({})
  ]
};
