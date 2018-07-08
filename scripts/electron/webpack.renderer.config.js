const path = require('path')
const { dependencies } = require('../../package.json')

const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const devMode = process.env.NODE_ENV !== 'production'

function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}

module.exports = {
	//development or production
	// mode : 'development', 
	entry : {
		renderer : resolve('src/platforms/electron/renderer/index.js')
	},
	output : {
		filename : '[name].js',
		libraryTarget: 'commonjs2',
		path: resolve('dist/electron')
	},
	module : {
		rules : [{
			test : /\.vue$/,
			loader: 'vue-loader'
		},{
			test : /\.css$/,
			use : [
				devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
				'css-loader'
			]
		},{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},{
	        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
	        use: {
	        	loader: 'url-loader',
	          	query: {
	            	limit: 10000,
	            	name: 'imgs/[name]--[folder].[ext]'
	          	}
	        }
      	},{
        	test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        	loader: 'url-loader',
        	options: {
          		limit: 10000,
          		name: 'media/[name]--[folder].[ext]'
        	}
      	},{
        	test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        	use: {
          		loader: 'url-loader',
          		query: {
            		limit: 10000,
            		name: 'fonts/[name]--[folder].[ext]'
          		}
        	}
      	}]
	},
	plugins : [
		new MiniCssExtractPlugin({
	      	filename: "[name].css",
	      	chunkFilename: "[id].css"
	    }),
		new HtmlWebpackPlugin({
		  	filename: 'index.html',
		  	template: resolve('src/platforms/electron/index.html'),
		  	minify: {
		  		collapseWhitespace: true,
		    	removeAttributeQuotes: true,
		    	removeComments: true
		  	}
		}),
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	],
	resolve: {
	  	alias: {
	    	'@': resolve('src/platforms/electron/renderer'),
	    	'vue$': 'vue/dist/vue.esm.js'
	  	},
	  	extensions: ['.js', '.vue', '.json', '.css', '.node']
	},
	externals: [
	  ...Object.keys(dependencies || {})
	],
	//生成source-map的类型
	devtool: 'source-map',
	target: 'electron-renderer'
}