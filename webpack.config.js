const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './assets/js/dev/_entry.js',

  output: {
    path: `${__dirname}/assets/js`,
    filename: 'script.js',
  },

  // バンドル対象から外す
  externals: {
    jquery: 'jQuery',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 2000,
      server: { baseDir: './' },
    }),
  ],
}
