'use strict'

const fs = require('fs');
const path = require('path');
const async = require('async');

const rootPath = __dirname;

/**
 * 初始化账号
 * @param  {[String]}   key [description]
 * @param  {[String]}   u   [description]
 * @param  {[String]}   p   [description]
 * @param  {Function} cb  [description]
 */
exports.init = function(key,u,p,cb){
	var app = require(path.join(rootPath,key));
	app.init(u,p,cb);
};

exports.destory = function(key,u,cb){
	var app = require(path.join(rootPath,key));
	if(app.destory){
		app.destory(u,cb);
	}else{
		cb();
	}
};

/**
 * 获取已开发的音乐APP模块
 */
exports.getModules = function(initModules,cb){
	var modules = [];
	fs.readdir(rootPath,function(err,files){
		for(var i = 0;i < files.length;i++){
			var f = files[i],
				mpath = path.join(rootPath,f),
				stat = fs.statSync(mpath);
			if(!stat.isDirectory() || files[i] == 'wy'){
				continue;
			}
			let module = require(mpath);
			modules.push({
				key : f,
				name : module.appname,
				inited : initModules[f] ? true : false
			});
		}
		cb(modules);
	});
};

/**
 * 获取歌单列表
 * @param  {[Array]} initModules [已加载模块数组]
 */
exports.getAlbums = function(initModules,cb){
	initModules = initModules || {};
	fs.readdir(rootPath,function(err,files){
		var funs = [];
		for(var i = 0;i < files.length;i++){
			var f = files[i],
				mpath = path.join(rootPath,f),
				stat = fs.statSync(mpath);
			if(!initModules[f] || !stat.isDirectory()){
				continue;
			}
			let module = require(mpath);
			if(module.getAlbums){
				let u = initModules[f].u,
					fun = function(callback){
						module.getAlbums(u,function(json){
							callback(null,json)
						}
					)};
				funs.push(fun);		
			}
		}
		async.series(funs,function(err,array){
			var albums = [];
			for(var i in array){
				albums = albums.concat(array[i]);
			}
			cb(albums);
		});
	});
};

/**
 * 获取歌词列表
 * @param  {[String]}   key [description]
 * @param  {[String]}   u   [description]
 * @param  {[String]}   id  [description]
 */
exports.getAlbum = function(key,u,id,cb){
	var app = require(path.join(rootPath,key));
	app.getAlbum(u,id,cb);
};

/**
 * 获取我喜欢的音乐
 * @param  {[type]}   initModules  [description]
 * @param  {Function} cb [description]
 */
exports.getFavSongs = function(initModules,cb){
	fs.readdir(rootPath,function(err,files){
		var funs = [];
		for(var i = 0;i < files.length;i++){
			var f = files[i],
				mpath = path.join(rootPath,f),
				stat = fs.statSync(mpath);
			if(!initModules[f] || !stat.isDirectory()){
				continue;
			}
			let module = require(mpath);
			if(module.getFavSongs){
				let u = initModules[f].u,
					fun = function(callback){
						module.getFavSongs(u,function(json){
							callback(null,json)
						}
					)};
				funs.push(fun);		
			}
		}
		async.series(funs,function(err,array){
			var songs = [];
			for(var i in array){
				songs = songs.concat(array[i]);
			}
			var info = {
                name : '我喜欢的',
                createTime : '2016-07-09',
                count : songs.length
            };
			cb({ info : info ,songs : songs });
		});
	});
};

/**
 * 获取指定歌曲
 * @param  {[type]}   key [description]
 * @param  {[type]}   u   [description]
 * @param  {[type]}   id  [description]
 * @param  {Function} cb  [description]
 */
exports.getSongSrc = function(key,id,cb){
	var app = require(path.join(rootPath,key));
	if(app.getSongSrc){
		app.getSongSrc(id,cb);
	}else{
		cb('');
	}
};
