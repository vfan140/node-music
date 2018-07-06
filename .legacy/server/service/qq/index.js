const url = require('url');
const vm = require('vm');
const request = require('request');
const async = require('async');
const _ = require('lodash');
const str = require('./str.js');
const Encryption =  require('./encryption.js');
const cookieStorage = require('../../utils/cookie-storage.js');

//模拟UA
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36';
//QQ音乐appId
const appid = '24000201';
const appname = 'QQ音乐';

var qqMuicCache = {};

/**
 * QQ音乐内部逻辑开始
 */
function QQMusic(u,p){
    this.u = u;
    this.p = p;
    //定时器,1小时后重新构建QQMusic对象更新
    this.timer = setInterval((function(that){
        return function(){
            var u = that.u,
                p = that.p,
                newQQMusic = new QQMusic(u,p);
            newQQMusic.init(function(){});
            clearInterval(that.timer);
            delete that;
            qqMuicCache[u] = newQQMusic;
        };
    })(this),1000 * 60 * 60);
};

var proto = QQMusic.prototype;
proto.init = init;
proto.getLoginSign = getLoginSign;
proto.checkLoginSign = checkLoginSign;
proto.getSkey = getSkey;
proto.getPskey = getPskey;
proto.getAlbums = getAlbums;
proto.getAlbum = getAlbum;

function init(cb){
    async.series({
        getLoginSign : _.bind(this.getLoginSign,this),
        checkLoginSign :  _.bind(this.checkLoginSign,this),
        getSkey : _.bind(this.getSkey,this)
    },cb);
    this.inited = true;
}

/**
 * 获取g_token，根据skey值换取
 * @param skey [skey]
 */
function getGTK(skey){
    var hash = 5381;
    for(var i = 0, len = skey.length; i < len; ++i){
        hash += (hash << 5) + skey.charCodeAt(i);
    }
    return hash & 0x7fffffff;
}

/**
 * 异步获取登陆签名
 * @param   cb  [回调函数]
 */
function getLoginSign(cb){
    var that = this;
    var host = 'ui.ptlogin2.qq.com',
        signURL = url.format({
            protocol : 'http',
            host : host,
            pathname : 'cgi-bin/login',
            query : {
                appid : appid,
                s_url : 'http://music.qq.com/close.html'  
            }
        });
    request({
        url : signURL,
        headers:{
            Host : host,
            'User-Agent' : ua
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
 * 校验签名
 * @param   cb   [回调函数]
 */
function checkLoginSign(cb){
    var that = this;
    var host = 'check.ptlogin2.qq.com',
        _cookies =  cookieStorage.fetchCookie({
            owner : that.u,
            path : host 
        });
    if(!_cookies['pt_login_sig']){
        var e =  new Error('miss cookie sign,run Method `getLoginSign` to get it!');
        cb(e);
        return;
    }
    var sign = _cookies['pt_login_sig'].value;
        checkURL = url.format({
            protocol : 'http',
            host : host,
            pathname : 'check',
            query : {
                pt_tea : '2',
                uin : that.u,
                appid : appid,
                js_ver : '10160',
                js_type : '1',
                login_sig : sign,
                u1 : 'http://music.qq.com/close.html'
            }
        });
    request({
        url : checkURL,
        headers:{
            Host : host,
            'User-Agent' : ua
        }
    },function(err,res){
        if(err) 
            cb(err);
        var body = res.body,
            context = new vm.createContext({
                ptui_checkVC : function(t,verifycode,s,verifysession){
                    //将后续要用到的verifycode、verifysession扔到顶层cookie
                    cookieStorage.storeCookie({
                        name : 'verifycode',
                        value : verifycode,
                        domain : 'qq.com',
                        path : ''
                    },{owner : that.u});
                    cookieStorage.storeCookie({
                        name : 'verifysession',
                        value : verifysession,
                        domain : 'qq.com',
                        path : ''
                    },{owner : that.u});
                    cb(null);
                }
            }),
            script = new vm.Script(res.body);
            script.runInContext(context);
    });  
}

/**
 * 获取访问QQ API必需参数skey、pskey
 */
function getSkey(cb){
    var that = this;
    var host = 'ptlogin2.qq.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host 
        });
    if(!_cookies['verifycode']){
        var e = new Error('miss verifycode,run callback Method `ptui_checkVC` can get it(ptui_checkVC will run after `checkLoginSign` run. )');
        cb(e);
        return;
    }   
    if(!_cookies['verifysession']){
        var e = new Error('miss verifysession,run callback Method `ptui_checkVC` can get it(ptui_checkVC will run after `checkLoginSign` run. )');
        cb(e);
        return;
    }  
    var salt = str.uin2hex(that.u),
        _p = Encryption.getEncryption(that.p,salt,_cookies['verifycode'].value);
    var loginURL = url.format({
            protocol : 'http',
            host : host,
            pathname : 'login',
            query : {
                u : that.u,
                p : _p,
                verifycode :_cookies['verifycode'].value,
                daid : '384',
                aid : appid,
                u1 : 'http://music.qq.com/close.html',
                from_ui : 1,
                login_sig : _cookies['pt_login_sig'].value,
                pt_randsalt : 2,
                pt_vcode_v1 : '0',
                pt_verifysession_v1 : _cookies['verifysession'].value
            }
        });
        request({
            'url' : loginURL,
            'headers':{
                'Host' : host,
                'User-Agent' : ua
            }
        },function(err,res){
            if(err)
                cb(err);
            var rawCookies = res.headers['set-cookie'];
            cookieStorage.parseRawCookie(rawCookies,{
                save : true,
                owner : that.u
            });
            var context = new vm.createContext({
                'ptuiCB' : function(a,b,url){
                    that.getPskey(url,function(err,result){
                        cb(err);
                    });
                }
            }),script = new vm.Script(res.body);
            script.runInContext(context);        
        });
}

/**
 * 获取访问QQ API必需参数p_skey
 */

function getPskey(fetchURL,cb){
    var that = this;
    var options = {
        'followRedirect' : false,
        'url' : fetchURL,
        'headers':{
            'Host':'ptlogin4.y.qq.com',
            'User-Agent' : ua,
        }
    };
    request(options,function(err,res){
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
 * 获取歌单列表
 * @return {[type]} [description]
 */
function getAlbums(cb){
    var that = this;
    var host = 'i.y.qq.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        });
    if(!_cookies['skey'] || !_cookies['p_skey']){
        throw new Error('miss cookie skey or p_key,run Method `getSkey` and `getPskey` to get them');
    }
    var gtk = getGTK(_cookies['skey'].value);
    var songURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 's.plcloud/fcgi-bin/songlist_list.fcg',
        query : {
            utf8 : '1',
            uin : that.u,
            g_tk : gtk,
            loginUin : that.u,
            hostUin : '0',
            format : 'jsonp',
            inCharset : 'GB2312',
            outCharset : 'utf-8',
            notice : '0',
            platform : 'yqq',
            jsonpCallback : 'MusicJsonCallBack',
            needNewCode : '0'
        }
    });
    request({
            'url' : songURL,
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
    var host = 'i.y.qq.com',
        _cookies = cookieStorage.fetchCookie({
            owner : that.u,
            path : host
        });
    if(!_cookies['skey'] || !_cookies['p_skey']){
        throw new Error('miss cookie skey or p_key,run Method `getSkey` and `getPskey` to get them');
    }
    var gtk = getGTK(_cookies['skey'].value);
    var songsURL = url.format({
        protocol : 'http',
        host : host,
        pathname : 's.plcloud/fcgi-bin/fcg_musiclist_getinfo_cp.fcg',
        query : {
            uin : that.u,
            dirid : id,
            g_tk : gtk,
            loginUin : that.u,
            hostUin : '0',
            format : 'jsonp',
            inCharset : 'GB2312',
            outCharset : 'utf-8',
            notice : '0',
            platform : 'yqq',
            jsonpCallback : 'jsonCallback',
            needNewCode : '0'
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
 * 初始化QQ音乐账号
 * @param  {[type]}   u  [description]
 * @param  {[type]}   p  [description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
exports.init = function(u,p,cb){
    if(qqMuicCache[u]){
        var originMusic = qqMuicCache[u];
        clearInterval(originMusic.timer);
        delete originMusic;
    }
    qqMuicCache[u] = new QQMusic(u,p);
    var qqMusic = qqMuicCache[u];
    qqMusic.init(cb);
};

/**
 * 销毁当前账号
 * @param  {[type]}   u  [description]
 * @param  {Function} cb [description]
 */
exports.destory = function(u,cb){
    if(qqMuicCache[u]){
        var qqMuic = qqMuicCache[u];
        clearInterval(qqMuic.timer);
        delete qqMuic;
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
    if(!qqMuicCache[u]){
        cb([]);
    }
    var qqMusic = qqMuicCache[u];
    if(!qqMusic.inited){
        cb([]);
    }else if(qqMusic['albums']){
        cb(qqMusic['albums']);
    }else{
        qqMusic.getAlbums(function(err,result){
            var albumsList = result.list,
                albums = [];
            for (var i = albumsList.length - 1; i >= 0; i--) {
                //暂时这样做个特殊处理
                if(albumsList[i].dirname.indexOf('背景音乐') > -1 
                    || albumsList[i].dirname.indexOf('我喜欢') > -1){
                    continue;
                }
                var album = {
                    from : 'qq',
                    id : albumsList[i].dirid + '#qq',
                    dirid : albumsList[i].dirid,
                    disstid : albumsList[i].disstid,
                    name : albumsList[i].dirname,
                    createTime : albumsList[i].createTime,
                    updateTime : albumsList[i].updateTime,
                    songNum : albumsList[i]['song_num'],
                    description : albumsList[i].description
                };
                albums.push(album);
            }
            qqMusic['albums'] = albums;
            cb(qqMusic['albums']);
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
    if(!qqMuicCache[u]){
        cb([]);
    }
    var qqMusic = qqMuicCache[u];
    if(!qqMusic.inited){
        cb([]);
    }else if(qqMusic['favSongs']){
        cb(qqMusic['favSongs']);
    }else{
        var getAlbumcb = function(err,result){
            var songList = result.SongList,
                songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'qq',
                    appname : appname,
                    id : songList[i].id,
                    songid : songList[i].songid,
                    songmid : songList[i]['song_mid'],
                    songname : songList[i].songname,
                    singername : songList[i].singername,
                    diskname : songList[i].diskname,
                    src:'http://thirdparty.gtimg.com/C100'+ songList[i]['media_mid'] +'.m4a?fromtag=38'
                };
                songs.push(song);
            }
            qqMusic['favSongs'] = songs;
            cb(songs);
        };
        var getAlbumscb = function(err,result){
            var albumsList = result.list;
            for (var i = albumsList.length - 1; i >= 0; i--) {
                if(albumsList[i].dirname.indexOf('我喜欢') > -1){
                    var id = albumsList[i].dirid;
                    qqMusic.getAlbum(id,getAlbumcb);
                    break;
                }
            }
        };
        qqMusic.getAlbums(getAlbumscb);
    }
};

/**
 * 获取指定id歌单
 * @param  {[String]}   u  [用户]
 * @param  {[String]}   id [制定歌单]
 * @param  {Function} cb [description]
 */
exports.getAlbum = function(u,id,cb){
    if(!qqMuicCache[u]){
        cb({});
    }
    var qqMusic = qqMuicCache[u];
    if(!qqMusic.inited){
        cb({});
    }else{
        qqMusic['songList'] = qqMusic['songList'] || {};
        if(qqMusic['songList'][id]){
            cb(qqMusic['songList'][id]);
            return;            
        }
        qqMusic.getAlbum(id,function(err,result){
            var info = {
                name : result.Title,
                createTime : result.CreateTime,
                tags : result.tagList,
                desc : result.Desc,
                count : result.SongCount
            },
                songList = result.SongList,
                songs = [];
            for (var i = songList.length - 1; i >= 0; i--) {
                var song = {
                    from : 'qq',
                    appname : appname,
                    id : songList[i].id,
                    songid : songList[i].songid,
                    songmid : songList[i]['song_mid'],
                    songname : songList[i].songname,
                    singername : songList[i].singername,
                    diskname : songList[i].diskname,
                    src:'http://thirdparty.gtimg.com/C100'+ songList[i]['media_mid'] +'.m4a?fromtag=38'
                };
                songs.push(song);
            }
            var ret = { info : info,songs : songs };
            qqMusic['songList'][id] = ret;
            cb(ret);    
        });
    }
};