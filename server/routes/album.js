const service = require('../service');

/**
 * 获取所有歌单列表路由
 * @param  {[express.Request]} req [express请求]
 * @param  {[express.Response]} res [express响应]
 */
function getAlbums(req,res){
 	//已加载模块列表
	var initModules = req.session.initModules || {};
	service.getAlbums(initModules,function(result){
		res.writeHead(200,{
			'Content-Type' : 'application/json;charset=utf-8'
		});
		res.end(JSON.stringify(result),'utf-8');
	});
}

/**
 * 获取指定歌单路由
 * @param  {[express.Request]} req [express请求]
 * @param  {[express.Response]} res [express响应]
 */
function getAlbum(req,res){
	var key = req.query.key,
		id = req.query.id;
	var initModules = req.session.initModules || {},
		u = initModules[key].u;	
	service.getAlbum(key,u,id,function(result){
		res.writeHead(200,{
			'Content-Type' : 'application/json;charset=utf-8'
		});
		res.end(JSON.stringify(result),'utf-8');
	});
}

/**
 * 获取我喜欢的音乐
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
function getFavSongs(req,res){
	var initModules = req.session.initModules || {};
	service.getFavSongs(initModules,function(result){
		res.writeHead(200,{
			'Content-Type' : 'application/json;charset=utf-8'
		});
		res.end(JSON.stringify(result),'utf-8');
	});	
}

/**
 * 获取指定歌曲路径
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
function getSongSrc(req,res){
	var key = req.query.key,
		id = req.query.id;
	service.getSongSrc(key,id,function(result){
		res.writeHead(200,{
			'Content-Type' : 'text/html;charset=utf-8'
		});
		res.end(result,'utf-8');
	});	
}

exports.getAlbums = getAlbums;
exports.getAlbum = getAlbum;
exports.getFavSongs = getFavSongs;
exports.getSongSrc = getSongSrc;