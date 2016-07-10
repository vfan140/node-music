require('../resource/css/font-awesome.css');
require('../../node_modules/vue-strap/node_modules/bootstrap/dist/css/bootstrap.css');
require('../resource/css/app.css');//TODO 组件的样式剥离出来

var Vue = require('vue'),
	vueTemplate = require('./app.vue'),
	ModulesComponent = require('./modules.js'),
	AlbumsComponent = require('./albums.js'),
	AlbumComponent = require('./album.js'),
	PlayerComponent = require('./player.js');

module.exports = Vue.extend({

	template : vueTemplate,

	ready : function(){
		//加载模块
		this.getModules();
		//加载歌单
		this.getAlbums();
	},

	components : {
		modulesComponent : ModulesComponent,
		albumsComponent : AlbumsComponent,
		albumComponent : AlbumComponent,
		playerComponent : PlayerComponent
	},

	data : function(){
		return {
			modules : [],//模块
			albums : [], //歌单
			activeAlbum : 'history', //当前选中的歌单,默认随机音乐
			playSong : null,//当前正在播放的歌曲
			playSongList : []//当前正在播放的歌曲列表
		};
	},

	methods : {
		getModules : function(){
			var that = this;
			var promise = that.$http.get('/modules');
			promise.then(function(res){
				that.modules = res.data;
			});
		},
		getAlbums : function(){
			var that = this;
			var promise = that.$http.get('/albums');
			promise.then(function(res){
				that.albums = res.data;
			});
		}
	},

	events : {
		//模块信息发生变化(登陆、登出等)
		'module-changed' : function(___module){
			for(var i = 0;i < this.modules.length;i++){
				var module = this.modules[i];
				if(module.key == ___module.key){
					module.inited = ___module.inited;
					break;
				}
			}
			this.getAlbums();//重新拉取一遍歌单
		},
		//所选歌单发生变化
		'active-album-changed' : function(activeAlbum){
			this.activeAlbum = activeAlbum;
		},
		//所选歌曲发生变化
		'song-changed' : function(obj){
			this.playSong = obj.playSong;
			this.playSongList = obj.playSongList;
		}
	}

});