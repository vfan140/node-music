import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomePage = () => import(/* webpackChunkName: "index" */ '@/components/HomePage')

export default new Router({
	routes : [{
		path: '/',
		name : 'home-page',
		component :  HomePage
	}]
})