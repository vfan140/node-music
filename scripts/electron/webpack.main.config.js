const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}

module.exports = {
	// mode : 'development',
	entry: {
	  main: resolve('src/platforms/electron/main/index.js')
	},
	output: {
	  filename: '[name].js',
	  libraryTarget: 'commonjs2',
	  path: resolve('dist/electron')
	},
	module: {
	  rules: [{
	      test: /\.js$/,
	      use: 'babel-loader',
	      exclude: /node_modules/
	   }]
	},
	plugins: [
	  new webpack.NoEmitOnErrorsPlugin()
	],
	resolve: {
	  extensions: ['.js', '.json', '.node']
	},
	target: 'electron-main'
}