
var Vue = require('vue'),
	vueTemplate = require('./modules.vue'),
	Modal = require('vue-strap').modal;

module.exports = Vue.extend({

	template : vueTemplate,

	components : {
		modal : Modal
	},

	props : ['modules'],

	data : function(){
		return {
			showModal : false,
			key : '',//音乐app key值
			u : '',//缓存账号
			p : ''//缓存密码
		};
	},

	methods : {
		openLoginModal : function(key){
			this.$data.key = key;
			this.showModal = true;
		},
		doLogin : function(){
			var that = this,
				promise = this.$http.post('/init',{
					key :this.$data.key,
					u : this.u,
					p : this.p
				});
			
			promise.then(function(res){
				var status = res.data.status,
					key = res.data.key;
				if(status == 'success'){
					that.$dispatch('module-changed',{
						key : key,
						inited : true
					});
					that.$data.showModal = false;	
					that.reset();
				}else{
					alert('账号或密码错误!');
				}
			});
		},
		doLogout : function(){

		},
		reset : function(){
			this.$data.key = '';
			this.u = '';
			this.p = '';
		}
	}


});




