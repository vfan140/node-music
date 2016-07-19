const url = require('url');
const vm = require('vm');
const async = require('async');
const request = require('request');
const _ = require('lodash');
const Decode = require('./decode.js');
const cookieStorage = require('../../utils/cookie-storage.js');

//模拟UA
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';
const appname = '虾米音乐';

var xiaMiMuicCache = {};

/**
 * 虾米音乐内部逻辑开始
 */
function XiaMiMusic(u,p){
    this.u = u;
    this.p = p;
    //定时器,1小时后重新构建XiaMiMusic对象更新
    this.timer = setInterval((function(that){
        return function(){
            var u = that.u,
                p = that.p,
                newXiamiMusic = new XiaMiMusic(u,p);
            newXiamiMusic.init(function(){});
            clearInterval(that.timer);
            delete that;
            xiaMiMuicCache[u] = newXiamiMusic;
            console.log(u+' has reload!');
        };
    })(this),1000 * 60 * 60);
};

var proto = XiaMiMusic.prototype;
proto.init = init;
proto.getXiamiTokenSync = getXiamiTokenSync;
proto.getMemberAuthSync = getMemberAuthSync;
proto.getAlbums = getAlbums;
proto.getAlbum = getAlbum;
proto.getFavSong = getFavSong;

function init(cb){
    async.series({
        getXiamiTokenSync : _.bind(this.getXiamiTokenSync,this),
        getMemberAuthSync : _.bind(this.getMemberAuthSync,this)
    },cb);
    this.inited = true;
}

/**
 * 获取虾米音乐临时Token
 */
function getXiamiTokenSync(cb){
	var that = this,
        host = 'login.xiami.com',
        tokenURL = url.format({
            protocol : 'https',
            host : host,
            pathname : 'member/login'
        });
    request({
        url : tokenURL,
        headers:{
            Host : host,
            'User-Agent' : ua,
            'Upgrade-Insecure-Requests' : '1'
        }
    },function(err,res){
        if(err) cb(err);
        var rawCookies = res.headers['set-cookie'];
        cookieStorage.parseRawCookie(rawCookies,{
            save : true,
            owner : that.u
        });
        cb(null);  
    });        
}

/**
 * 获取memberAuth
 * @param  {Function} cb [description]
 */
function getMemberAuthSync(cb){
	var that = this,
        host = 'login.xiami.com',
		loginUrl = url.format({
			protocol : 'https',
            host : host,
            pathname : 'member/login',
            query : {
            	callback : 'jQuery7_11'
            }
		}),
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host 
        });
    if(!_cookies['_xiamitoken']){
        var e = new Error('miss cookie _xiamitoken,run Method `getXiamiTokenSync` to get it!');
        cb(e);
        return;
    }
	request.post({
		url : loginUrl,
		headers:{
            'Host':host,
            'User-Agent' : ua
        },
		form : {
			_xiamitoken : _cookies['_xiamitoken'].value,
			done : 'http://www.xiami.com/',
			from : 'web',
			email : this.u,
			password : this.p,
			submit : '登 录'
		}
	},function(err,res){
        if(err)
            cb(err);
        var context = new vm.createContext({
            'jQuery7_11' : function(json){
                var e = null;
                if(json.status){
                   var rawCookies = res.headers['set-cookie'];
                   cookieStorage.parseRawCookie(rawCookies,{
                       save : true,
                       owner : that.u
                   });//存储cookie
                }else{
                    e = new Error('login fail');
                }
                cb(e); 
            }
        }),script = new vm.Script(res.body);
        script.runInContext(context); 
	});
}

/**
 * 获取`我喜欢的`歌单
 * @param  {Function} cb [description]
 */
function getFavSong(cb){
	var that = this,
        host = 'xiami.com',
		songUrl = url.format({
			protocol : 'http',
            host : host,
            pathname : 'playersong/getgradesong'
		}),
        _cookies =  cookieStorage.fetchCookie({
            owner : this.u,
            path : host 
        });
    if(!_cookies['member_auth']){
        throw new Error('miss cookie member_auth,run Method `getMemberAuthSync` to get it!');
    }
	request({
		url : songUrl,
		headers:{
            'Host':host,
            'User-Agent' : ua,
            'Cookie' : cookieStorage.serializeCookies(_cookies)
        }
	},function(err,res){
		var ret = JSON.parse(res.body);
        cb(null,ret);
	});	
}

/**
 * 获取歌单列表
 * @return {[type]} [description]
 */
function getAlbums(cb){
    var that = this;
    var host = 'xiami.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        });
    var albumsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'playercollect/list',
        query : {
            callback : 'MusicJsonCallBack'
        }
    });
    request({
            'url' : albumsURL,
            'headers':{
                'Host':host,
                'User-Agent' : ua,
                'Cookie' :cookieStorage.serializeCookies(_cookies)
            }
        },function(error,res){
            var context = new vm.createContext({
                'MusicJsonCallBack' : function(json){
                    cb(null,json);
                }
            }),script = new vm.Script(res.body);
            script.runInContext(context); 
    });
}

/**
 * 获取指定歌单的歌曲列表
 * @param  {[String]}   id [歌单ID]
 * @param  {Function} cb [回调函数]
 */
function getAlbum(id,cb){
    var that = this;
    var host = 'xiami.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        });
    var songsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'playercollect/detail',
        query : {
            list_id : id,
            callback : 'jsonCallback'
        }
    });
    request({
            'url' : songsURL,
            'headers':{
                'Host':host,
                'User-Agent' : ua,
                'Cookie' :cookieStorage.serializeCookies(_cookies)
            }
        },function(error,res){
            var context = new vm.createContext({
                'jsonCallback' : function(json){
                    cb(null,json);
                }
            }),script = new vm.Script(res.body);
            script.runInContext(context); 
    });  
}


exports.appname = appname;

/**
 * 初始化虾米音乐账号
 * @param  {[type]}   u  [description]
 * @param  {[type]}   p  [description]
 * @param  {Function} cb [description]
 */
exports.init = function(u,p,cb){
    if(!xiaMiMuicCache[u]){
        xiaMiMuicCache[u] = new XiaMiMusic(u,p);
    }
    var xiaMiMuic = xiaMiMuicCache[u];
    if(xiaMiMuic.inited){
        cb();
    }else{
        xiaMiMuic.init(cb);
    }
};

/**
 * 销毁当前账号
 * @param  {[type]}   u  [description]
 * @param  {Function} cb [description]
 */
exports.destory = function(u,cb){
    if(xiaMiMuicCache[u]){
        var xiaMiMuic = xiaMiMuicCache[u];
        clearInterval(xiaMiMuic.timer);
        delete xiaMiMuic;
    }
    cb();
};

/**
 * 获取歌单
 * @param  {[type]} u [description]
 * @param  {[type]} p [description]
 * @param  {Function} cb [description]
 */
exports.getAlbums = function(u,cb){
    if(!xiaMiMuicCache[u]){
        cb([]);
    }
    var xiaMiMuic = xiaMiMuicCache[u];
    if(!xiaMiMuic.inited){
        cb([]);
    }else if(xiaMiMuic['albums']){
        cb(xiaMiMuic['albums']);
    }else{
        xiaMiMuic.getAlbums(function(err,result){
            var albumsList = result.data,
                albums = [];
            for (var i = albumsList.length - 1; i >= 0; i--) {
                //暂时这样做个特殊处理
                if(albumsList[i].name.indexOf('默认精选集') > -1){
                    continue;
                }
                var album = {
                    from : 'xiami',
                    id : albumsList[i]['list_id'] + '#xiami',
                    dirid : albumsList[i]['list_id'],
                    name : albumsList[i].name,
                    createTime : '2016-06-16',
                    songNum : albumsList[i]['song_count']
                };
                albums.push(album);
            }
            xiaMiMuic['albums'] = albums;
            cb(xiaMiMuic['albums']);
        });
    }
};

/**
 * 获取指定id歌单
 * @param  {[String]}   u  [用户]
 * @param  {[String]}   id [制定歌单]
 * @param  {Function} cb [description]
 */
exports.getAlbum = function(u,id,cb){
    if(!xiaMiMuicCache[u]){
        cb([]);
    }
    var xiaMiMuic = xiaMiMuicCache[u];
    if(!xiaMiMuic.inited){
        cb([]);
    }else{
        xiaMiMuic.getAlbum(id,function(err,result){
            var result = result.data;
            var info = {
                name : result.name,
                createTime : result['gmt_create'],
                count : result['song_count']
            },
            songList = result.song,
            songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'xiami',
                    appname : appname,
                    id : songList[i].songId,
                    songid : songList[i].songId,
                    songname : songList[i].name,
                    singername : songList[i].singers,
                    diskname : songList[i]['album_name']
                };
                songs.push(song);
            }

            cb({ info : info,songs : songs });  
        });
    }
};

/**
 * 获取我喜欢的歌
 * @param  {[type]}   u  [description]
 * @param  {[type]}   p  [description]
 * @param  {Function} cb [description]
 */
exports.getFavSongs = function(u,cb){
    if(!xiaMiMuicCache[u]){
        cb([]);
    }
    var xiaMiMuic = xiaMiMuicCache[u];
    if(!xiaMiMuic.inited){
        cb([]);
    }else if(xiaMiMuic['favSongs']){
        cb(xiaMiMuic['favSongs']);
    }else{
        xiaMiMuic.getFavSong(function(err,result){
            var result = result.data,
                songList = result.songs,
                songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'xiami',
                    appname : appname,
                    id : songList[i].songId,
                    songid : songList[i].songId,
                    songname : songList[i].name,
                    singername : songList[i].singers,
                    diskname : songList[i]['album_name']
                };
                songs.push(song);
            }
            cb(songs);
        });
    }
};

/**
 * 获取指定歌曲的链接
 * @param  {[type]}   id [description]
 * @param  {Function} cb [description]
 */
exports.getSongSrc = function (id,cb){
    request({
        url : 'http://www.xiami.com/song/gethqsong/sid/'+ id,
        headers:{
            'Host':'xiami.com',
            'User-Agent' : ua,
            'X-Requested-With':'ShockwaveFlash/22.0.0.192'
        }
    },function(err,res){
        var json =  JSON.parse(res.body);
        cb(Decode(json.location));
    }); 
};

