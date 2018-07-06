var Vue = require('vue'),
	vueTemplate = require('./album.vue');

module.exports = Vue.extend({

	template : vueTemplate,

	props : ['album'],

	data : function(){
		return {
			albumobj : {}
		};
	},

	computed : {
		songs : function(){
			return this.albumobj.songs;
		},
		info : function(){
			return this.albumobj.info;
		}
	},

	ready : function(){
		this.$watch('album',function(){
			var album = this.album;
			if(!album)	return;
			if(album == 'history'){
				return;
			}else if(album == 'love'){
				this.getFavSongs();
			}else{
				var id = album.split('#')[0],
					key = album.split('#')[1];
				this.getAlbum(key,id);
			}
		});
	},

	methods : {
		getAlbum : function(key,id){
			var that = this;
			var promise = that.$http.get('/album?key='+key + '&id=' + id);
			that.$dispatch('loading-changed',true);	
			promise.then(function(res){
				that.albumobj = res.data;
				that.$dispatch('loading-changed',false);	
			});
		},
		getFavSongs : function(){
			var that = this;
			var promise = that.$http.get('/favsongs');
			that.$dispatch('loading-changed',true);
			promise.then(function(res){
				that.albumobj = res.data;
				that.$dispatch('loading-changed',false);
			});
		},
		selectSong : function(song,songs){
			this.$dispatch('song-changed',{
				playSong : song,
				playSongList : songs
			});
		}
	}

});

