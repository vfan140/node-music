var Vue = require('vue'),
	vueTemplate = require('./player.vue');

module.exports = Vue.extend({

	template : vueTemplate,

	props : ['song','songs'],

	data : function(){
		return {
			now : 0, //当前播放时间,单位秒
			duration : 0 //全时长,单位秒
		};
	},

	computed : {
		nowText : function(){
			var now = this.$data.now;
			return this.formatTime(now);
		},
		durationText : function(){
			var duration = this.$data.duration;
			return this.formatTime(duration);
		},
		percent : function(){
			if(this.$data.duration == 0){
				return '0%';
			}
			return (this.$data.now / this.$data.duration) * 100 + '%';
		}
	},

	ready : function(){
		//音频播放器dom对象
		var audio = this.$data.audio = this.$el.querySelector('audio'),
			that = this;
		this.$watch('song',function(){
			that.$data.now = 0;
			if(this.song['src']){//如果该歌曲包含了src,直接读取src,否则再异步请求src
				audio.src = this.song['src'];
				audio.load();
			}else{
				console.log(this.song);
				var url = '/songsrc?key=' + this.song['from'] + '&id=' + this.song['id'],
					promise = that.$http.get(url);
				promise.then(function(res){
					audio.src = res.data;
					audio.load();
				});	
			}
		});
		//数据加载完
		audio.addEventListener('loadeddata',function(){
			audio.play();
			that.$data.duration = audio.duration;
			var timer = setInterval(function(){
				that.$data.now = audio.currentTime;
				if(audio.duration <= audio.currentTime){
					clearInterval(timer);
					that.playSong(1);//播放下一首
				}
			},1000);
		});
		//加载失败,加载下一首歌
		audio.addEventListener('error',function(){
			if(that.songs && that.songs.length > 0)
				that.playSong(1);
		});
	},

	methods : {
		//根据偏移播放音乐
		playSong : function(position){
			//TODO 先记录,没有必要每次去计算
			var index = 0;
			for(var i = 0;i < this.songs.length;i++){
				var _song = this.songs[i];
				if(_song.id == this.song.id){
					index = i;
					break;
				}
			}
			//播放上一首
			if(position == -1){
				index = (index == 0) ? this.songs.length - 1 : index - 1;
			}
			//播放下一首
			if(position == 1){
				index = (index == this.songs.length - 1) ? 0 : index + 1;
			}
			this.song = this.songs[index];
		},
		//格式化时间为MM:SS
		formatTime : function(time){
			var	min = parseInt(time / 60),
				second = parseInt(time % 60);
			min = min >= 10 ? min : '0' + min;
			second = second >= 10 ? second : '0' + second; 	
			return min + ':' + second;
		}
	}

});