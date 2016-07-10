const fs = require('fs');
const vueServer = require("vue-server"); //服务端渲染vue的插件
const config = require('../../webpack.config.dev.js');
const service = require('../service');

var Vue = new vueServer.renderer(); //创建一个服务端的vue
var tmp = fs.readFileSync(config.ROOT + '/server/views/template.vue','utf-8');

/**
 * index路由
 * @param  {[express.Request]} req [express请求]
 * @param  {[express.Response]} res [express响应]
 */
var index = function(req,res){
	var vm = new Vue({
		replace : false,
		template : tmp
	});
	//等待html渲染完成，再返回给浏览器 vueServer.htmlReady是vue-server的自带事件
    vm.$on('vueServer.htmlReady', function(html){
    	res.render('index',{
    		vmHTML : html
    	});
    });
};

/**
 * init路由,记录登陆账号密码为后续获取相关信息
 * @param  {[express.Request]} req [express请求]
 * @param  {[express.Response]} res [express响应]
 */
var init = function(req,res){
	var u = req.body.u,
		p = req.body.p,
		key = req.body.key;
	service.init(key,u,p,function(err,result){
		var initModules = req.session.initModules = req.session.initModules || {};
		initModules[key]={
			u : u
		};
		res.end(key);
	});	
};

var modules = function(req,res){
	var initModules = req.session.initModules || {};
	service.getModules(initModules,function(__modules){
		res.writeHead(200,{
			'Content-Type' : 'application/json;charset=utf-8'
		});
		res.end(JSON.stringify(__modules),'utf-8');
	});
};

exports.index = index;
exports.init = init;
exports.modules = modules;