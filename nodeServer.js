// Setup webpack and express
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';

const app = express();
const compiler = webpack(config);

console.log("env in node server: ", ENV);
console.log("node env in node server: ", process.env.NODE_ENV);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(`${__dirname}/dist`));

app.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Listening on port %d`, PORT);
  console.info(`Go to http://localhost:%d to see the app`, PORT)
});
