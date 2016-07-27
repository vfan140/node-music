'use strict';
/**
 * set-cookie的获取、转换、存储API
 * @TODO cookie超时判断
 * @TODO fetchCookie方法的options.path支持正则
 * @todo 拓展数据存储方式（暂时只支持内存方式）
 */
const cookie = require('cookie');
const path = require('path');
const _ = require('lodash');

const pairSplitRegExp = /; */;

//个人项目,暂时把内存当存储空间
var cookieStorage = new Object();

/**
 * 将set-cookie转化为对象
 * @param  {[Array|String]} rawCookie [set-cookie]
 * @param  {[Object]} options   [选项]
 */
function parseRawCookie(rawCookies,options){
	if(!rawCookies) 
		return new Object();
	if(!Array.isArray(rawCookies)){
		throw new TypeError('rawCookies argument must be Array');
	}
	for(var i = 0;i < rawCookies.length;i++){
		var rawCookie = rawCookies[i],
			rawCookieParams = rawCookie.split(pairSplitRegExp),
			rawCookieNameAndValue = rawCookieParams[0].split('=');
		if (rawCookieNameAndValue.length != 2) {
        	console.log("Invalid rawCookie: missing name and value");
        	continue;
    	}
    	var c = {
    		name : rawCookieNameAndValue[0].trim(),
    		value : rawCookieNameAndValue[1].trim()
    	};
     	for (var j = 1; j < rawCookieParams.length; j++) {
     		rawCookieNameAndValue = rawCookieParams[j].split('=');
     		var paramName = rawCookieNameAndValue[0].trim().toLowerCase();
     		switch(paramName){
     			case 'secure' :
     			case 'httponly' :
     				c[paramName] = true;
     				break;	
     			case 'expires' :
     			case 'max-age' :
     			case 'comment' :
     			case 'domain' :
     			case 'path' :
     				c[paramName] = rawCookieNameAndValue[1].trim();
     				break;
     			default:
     				break;
     		}
     	}
     	if(options && options.save)
     		storeCookie(c,{ 
     			domain : options.domain,
     			path : options.path,
     			owner : options.owner || 'me' 
     		});
	}
}

/**
 * 存储cookie
 * @param  {[Obejct]} cookie  [Cookie对象]
 * @param  {[Object]} options [选项,必须包含cookie所有者owner]
 */
function storeCookie(cookie,options){
	if(!options.owner){
		console.log('miss option owner,can not store');
		return;
	}
	cookie['domain'] = cookie['domain'] || options.domain;
	cookie['path'] = cookie['path'] || options.path;
	var cookiePath = path.join(cookie['domain'],cookie['path'] || '');
	if(!cookiePath){
		console.log('miss cookiePath,can not store');
		return;
	}
	cookiePath = cookiePath.replace(/(\/$)|(^\.)/g,'');
	var mycookie = cookieStorage[options.owner]  = cookieStorage[options.owner]  || {};
	var myCookieInPath =  mycookie[cookiePath] = mycookie[cookiePath] || {};
	var name = cookie['name'];
	myCookieInPath[name] = cookie;
}

/**
 * 获取cookies
 * @param  {[String]} key     [指定cookie,可选]
 * @param  {[Obejct]} options [选项,options.owner必填]
 */
function fetchCookie(key,options){
	if(arguments.length == 1){
		options = key;
	}
	if(!options.owner){
		throw new Error('options owner can not be null');
	}
	if(!options.path){
		return cookieStorage[options.owner];
	}
	var ownerCookies = cookieStorage[options.owner],
		retCookies = {};
	for(var _key in ownerCookies){
		if(options.path.indexOf(_key) > -1){
			retCookies = _.assign(retCookies,ownerCookies[_key]);
		}
	}
	if(options.serialize){
		retCookies = serializeCookies(retCookies);
	}
	if(arguments.length == 2)
		return retCookies[key];
	return retCookies;
}

/**
 * 将cookie对象序列化
 * @param  {[Object]} cookies [指定路径下的cookie集合]
 */
function serializeCookies(cookies){
	var str = '';
	for(var key in cookies){
		//TODO 判断过期时间,如果过期顺手从cookieStorage中移除
		str += key+ '=' +cookies[key].value+'; ';
	}
	return str.trim();
}

exports.parseRawCookie = parseRawCookie;
exports.storeCookie = storeCookie;
exports.setCookie = storeCookie; //alias
exports.fetchCookie = fetchCookie;
exports.getCookie = fetchCookie; //alias
exports.serializeCookies = serializeCookies;
