require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

const absolutePath = path.resolve(__dirname, 'build');

module.exports = {
  mode: process.env.NODE_ENV,

  entry: ['@babel/polyfill', './src/renderer.js'],
  output: {
    path: absolutePath,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }, {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }, {
        test: /\.(png|jpg|svg)$/,
        use: [{ loader: 'file-loader' }]
      }
    ]
  },
  devtool: 'inline-source-map',
  target: 'electron-renderer',
  devServer: {
    contentBase: absolutePath,
    compress: true,
    port: process.env.PORT
  }
};