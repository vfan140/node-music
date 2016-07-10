'use strict';

var path = require('path'),
    webpack = require('webpack');

module.exports = {

	ROOT : __dirname,
	entry : {
		main : './client/main.js',
		vendor : ['vue','vue-router','vue-resource']		
	},
	output : {
		path: path.resolve(__dirname, '/build/'), //打包文件存放的绝对路径
		filename: '[name].js', //打包后的文件名
		publicPath: '/build/' //网站运行时的访问bundle.js路径
	},
	module : {
		loaders : [{
			test: /\.css$/,
            loader: 'style!css'//css Loader
		}, 
		{
            test: /\.js$/,
            loader: 'babel-loader'//babel Loader
        },
        { 
        	test: /\.vue$/, 
        	loader: "raw-loader" //raw Loader
        },{
        	test: /\.(png|jpg)$/, 
        	loader: 'url-loader?limit=8192' //img Loader
        }, 
        { 
        	test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        	loader: "url-loader?limit=10000&minetype=application/font-woff" //font-awesome
        },
        { 
        	test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        	loader: "file-loader" //font-awesome
        }] 
	},
	plugins : [
		new webpack.optimize.CommonsChunkPlugin({
			name : 'vendor'
		})
	]
};

