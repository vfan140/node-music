const url = require('url');
const async = require('async');
const request = require('request');
const _ = require('lodash');
const enc = require('./enc.js');
const cookieStorage = require('../../utils/cookie-storage.js');
const WY = require('./core.js');

//模拟UA
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';
const appname = '网易云';

var wyMusicCache = {};

/**
 * 网易云内部逻辑开始
 */
function WyMusic(u,p){
    this.u = u;
    this.p = p;
    //定时器,1小时后重新构建XiaMiMusic对象更新
    this.timer = setInterval((function(that){
        return function(){
            var u = that.u,
                p = that.p,
                newWyMusic = new WyMusic(u,p);
            newWyMusic.init(function(){});
            clearInterval(that.timer);
            delete that;
            wyMusicCache[u] = newWyMusic;
        };
    })(this),1000 * 60 * 60 * 10);
};

var proto = WyMusic.prototype;
proto.init = init;
proto.getWyCsrfSync = getWyCsrfSync;
proto.getAlbums = getAlbums;
proto.getAlbum = getAlbum;

function init(cb){
	async.series({
	    getWyCsrfSync : _.bind(this.getWyCsrfSync,this)
	},cb);
    this.inited = true;
}

function getWyCsrfSync(cb){
	var params = enc({
        username : this.u,
        password : WY.decodePassword(this.p),
        rememberLogin: true
    });
	var that = this,
        host = 'music.163.com',
        loginURL = url.format({
            protocol : 'http',
            host : host,
            pathname : 'weapi/login',
            query : {
                csrf_token : ''
            }
        });
    request.post({
        url : loginURL,
        headers:{
            Host : host,
            'User-Agent' : ua,
            'Origin' : 'http://music.163.com',
            'Referer' : 'http://music.163.com/'
        },
        form : params
    },function(err,res){
        if(err) cb(err);
        var rawCookies = res.headers['set-cookie'];
        cookieStorage.parseRawCookie(rawCookies,{
            save : true,
            domain : host,
            owner : that.u
        });
        cb(null);  
    });        
}

/**
 * 获取歌单列表
 * @return {[type]} [description]
 */
function getAlbums(cb){
    var that = this;
    var host = 'music.163.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        }),
        uid = _cookies['NETEASE_WDA_UID'].value;
    uid = uid.substring(0,uid.indexOf('#'));  
    var params = enc({
        'csrf_token' : _cookies['__csrf'].value,
        'limit' : '1001',
        'offset' : '0',
        'uid' : uid
    });
    var albumsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'weapi/user/playlist',
        query : {
            'csrf_token' : _cookies['__csrf'].value
        }
    });
    request.post({
            'url' : albumsURL,
            'headers':{
                'Host':host,
                'User-Agent' : ua,
                'Cookie' :cookieStorage.serializeCookies(_cookies),
                'Origin' : 'http://music.163.com',
                'Referer' : 'http://music.163.com/'
            },
            form : params
        },function(error,res){
            if(error){
                cb(error);
            }
            var ret = JSON.parse(res.body);
            cb(null,ret);
    });
} 

/**
 * 获取指定歌单的歌曲列表
 * @param  {[String]}   id [歌单ID]
 * @param  {Function} cb [回调函数]
 */
function getAlbum(id,cb){
    var that = this;
    var host = 'music.163.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        });
    var params = enc({
        'csrf_token' : _cookies['__csrf'].value,
        'id' : id,
        'limit' : '1000',
        'offset' : '0',
        'total' : 'true'
    });
    var songsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'weapi/v3/playlist/detail',
        query : {
            'csrf_token' : _cookies['__csrf'].value
        }
    });
    request.post({
            'url' : songsURL,
            'headers':{
                'Host':host,
                'User-Agent' : ua,
                'Cookie' :cookieStorage.serializeCookies(_cookies),
                'Origin' : 'http://music.163.com',
                'Referer' : 'http://music.163.com/'
            },
            form : params
        },function(error,res){
            if(error){
                cb(error);
            }
            var ret = JSON.parse(res.body);
            cb(null,ret);
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
    wyMusicCache[u] = new WyMusic(u,p);
    var wyMusic = wyMusicCache[u];
    if(wyMusic.inited){
        cb();
    }else{
        wyMusic.init(cb);
    }
};

/**
 * 销毁当前账号
 * @param  {[type]}   u  [description]
 * @param  {Function} cb [description]
 */
exports.destory = function(u,cb){
    if(wyMusicCache[u]){
        var wyMusic = wyMusicCache[u];
        clearInterval(wyMusic.timer);
        delete wyMusic;
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
    if(!wyMusicCache[u]){
        cb([]);
    }
    var wyMusic = wyMusicCache[u];
    if(!wyMusic.inited){
        cb([]);
    }else if(wyMusic['albums']){
        cb(wyMusic['albums']);
    }else{
        wyMusic.getAlbums(function(err,result){
            var albumsList = result.playlist,
                albums = [];
            for (var i = albumsList.length - 1; i >= 0; i--) {
                //暂时这样做个特殊处理
                if(albumsList[i].name.indexOf('喜欢的音乐') > -1){
                    continue;
                }
                var album = {
                    from : 'wy',
                    id : albumsList[i].id + '#wy',
                    dirid : albumsList[i].id,
                    name : albumsList[i].name,
                    createTime : albumsList[i].createTime,
                    updateTime : albumsList[i].updateTime,
                    songNum : albumsList[i].trackCount,
                    description : albumsList[i].name
                };
                albums.push(album);
            }
            wyMusic['albums'] = albums;
            cb(wyMusic['albums']);    
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
    if(!wyMusicCache[u]){
        cb([]);
    }
    var wyMusic = wyMusicCache[u];
    if(!wyMusic.inited){
        cb([]);
    }else if(wyMusic['favSongs']){
        cb(wyMusic['favSongs']);
    }else{
        var getAlbumcb = function(err,result){
            result = result.playlist;
            var songList = result.tracks,
                songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'wy',
                    appname : appname,
                    id : songList[i].id,
                    songname : songList[i].name,
                    singername : songList[i].ar[0].name, //TODO
                    diskname : songList[i].al.name
                };
                songs.push(song);
            }
            wyMusic['favSongs'] = songs;
            cb(songs);
        };
        var getAlbumscb = function(err,result){
            var albumsList = result.playlist;
            for (var i = albumsList.length - 1; i >= 0; i--) {
                if(albumsList[i].name.indexOf('喜欢的音乐') > -1){
                    var id = albumsList[i].id;
                    wyMusic.getAlbum(id,getAlbumcb);
                    break;
                }
            }
        };
        wyMusic.getAlbums(getAlbumscb);
    }
};

/**
 * 获取指定id歌单
 * @param  {[String]}   u  [用户]
 * @param  {[String]}   id [制定歌单]
 * @param  {Function} cb [description]
 */
exports.getAlbum = function(u,id,cb){
    if(!wyMusicCache[u]){
        cb({});
    }
    var wyMusic = wyMusicCache[u];
    if(!wyMusic.inited){
        cb({});
    }else{
        wyMusic['songList'] = wyMusic['songList'] || {};
        if(wyMusic['songList'][id]){
            cb(wyMusic['songList'][id]);
            return;            
        }
        wyMusic.getAlbum(id,function(err,result){
            result = result.playlist;
            var info = {
                name : result.name,
                createTime : result.createTime,
                desc : result.name,
                count : result.tracks.length
            },
                songList = result.tracks,
                songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'wy',
                    appname : appname,
                    id : songList[i].id,
                    songname : songList[i].name,
                    singername : songList[i].ar[0].name, //TODO
                    diskname : songList[i].al.name
                };
                songs.push(song);
            }
            var ret = { info : info,songs : songs };
            wyMusic['songList'][id] = ret;
            cb(ret);    
        });
    }
};

/**
 * 获取指定歌曲的链接
 * @param  {[type]}   id [description]
 * @param  {Function} cb [description]
 */
exports.getSongSrc = function (options,cb){
    var that = this;
    var host = 'music.163.com',
        _cookies = cookieStorage.fetchCookie({
            owner : options.u,
            path : host
        });
    var params = enc({
        'br' : 128000,
        'csrf_token' : _cookies['__csrf'].value,
        'ids' : '[' + options.id + ']'
    });
    var songURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'weapi/song/enhance/player/url',
        query : {
            'csrf_token' : _cookies['__csrf'].value
        }
    });
    request.post({
            'url' : songURL,
            'headers':{
                'Host':host,
                'User-Agent' : ua,
                'Cookie' :cookieStorage.serializeCookies(_cookies),
                'Origin' : 'http://music.163.com',
                'Referer' : 'http://music.163.com/'
            },
            form : params
        },function(error,res){
            if(error){
                cb(error);
            }
            var ret = JSON.parse(res.body);
            cb(ret.data[0].url);
    });
};

