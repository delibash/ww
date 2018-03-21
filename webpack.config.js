const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name]-[hash].css',
    allChunks: true,
    disable: process.env.NODE_ENV === 'production'
});

const ENV = process.env.NODE_ENV || 'development';


// Prod and Dev webpack configs
const webpackDev = require('./webpack.config.dev');
const webpackProd = require('./webpack.config.prod');
const apiUrl = {
  production: '"https://app.wadeandwendy.ai"',
  development: '"http://localhost:4567"',
  staging: '"https://app.staging.wadeandwendy.ai"'
}

const setUrl = new webpack.DefinePlugin({
  'API_URL': apiUrl[ENV]
});

let config = {
  context: path.join(__dirname),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js'
  },
  entry: [
    'font-awesome-webpack!./font-awesome.config.js'
  ],
  // modules
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.html?$/,
        loader: 'html-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]__[hash:base64:5]' }
            },
            // TODO: replace with config file: fix
            { loader: 'postcss-loader', options: {
              plugins: [
                require('postcss-import'),
                require('autoprefixer'),
                require('postcss-utilities'),
                require('lost'),
                require('rucksack-css')
              ]}
            },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.(png|jpg|jpeg|svg|woff|webp|gif)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: './public/images/[name]-[hash].[ext]'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: './public/fonts/[name]-[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    extractSass,
    setUrl
  ]
}

if (ENV === 'development' || ENV === 'staging') {
  module.exports = webpackMerge(config, webpackDev);
}

if (ENV === 'production') {
  module.exports = webpackMerge(config, webpackProd);
}
