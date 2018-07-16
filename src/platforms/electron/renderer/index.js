import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

Vue.prototype.$http = axios

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')