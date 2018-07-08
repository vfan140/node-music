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
		alias: {
	  		'@core': resolve('src/core')
		},
	  	extensions: ['.js', '.json', '.node']
	},
	node: {
	  __dirname: process.env.NODE_ENV !== 'production',
	  __filename: process.env.NODE_ENV !== 'production'
	},
	target: 'electron-main'
}