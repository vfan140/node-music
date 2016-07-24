const url = require('url');
const async = require('async');
const request = require('request');
const _ = require('lodash');
const enc = require('./enc.js');
const cookieStorage = require('../../utils/cookie-storage.js');

//模拟UA
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';

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
    })(this),1000 * 60 * 60);
};

var proto = WyMusic.prototype;
proto.init = init;
proto.getWyCsrfSync = getWyCsrfSync;
proto.getAlbums = getAlbums;

function init(cb){
	async.series({
	    getWyCsrfSync : _.bind(this.getWyCsrfSync,this)
	},cb);
    this.inited = true;
}

function getWyCsrfSync(cb){
	this.params = enc(this.u,this.p);
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
        form : this.params
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
        });
    var albumsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 'weapi/user/playlist',
        query : {
            'csrf_token' : _cookies['__csrf']
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
            form : this.params
        },function(error,res){
            cb(null,[]);
    });
}

exports.appname = '网易云';

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
            cb([]);
        });
    }
};
