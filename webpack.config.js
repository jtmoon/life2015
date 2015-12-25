var path = require('path');

module.exports = {
      entry: './src/lib.js',
      output: {
          path: __dirname + '/js',
          filename: 'life.js'
      },
      module: {
          loaders: [
              { test: path.join(__dirname, 'src'),
                loader: 'babel-loader' }
          ]
      },
      resolve: {
        fallback: path.join(__dirname, 'src')
      }
  };
