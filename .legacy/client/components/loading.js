var Vue = require('vue'),
	vueTemplate = require('./loading.vue');

module.exports = Vue.extend({

	template : vueTemplate,

	props : ['show']

});

