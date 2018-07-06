var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

var App = require('./components/app.js');

//开发模式
Vue.config.debug = true
// ES6 模板字符串
Vue.config.delimiters = ['${', '}']

Vue.use(VueRouter);
Vue.use(VueResource);

//路由实例化
var router = new VueRouter({
	history : true
});

//定义路由
router.map({
		
});

router.start(App, '#app');