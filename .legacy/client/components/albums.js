var Vue = require('vue'),
	vueTemplate = require('./albums.vue');

module.exports = Vue.extend({

	template : vueTemplate,

	props : ['albums','album'],

	methods : {
		activeChange : function(album){
			this.$dispatch('active-album-changed',album);
		}
	}

});