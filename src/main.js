// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from 'axios'
import VueRouter from 'vue-router'
import User from "./components/User"
import Worker from "./components/Worker"

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.prototype.$axios = Axios;
Vue.prototype.$HOST = "http://54.84.185.105:9991/";

//设置路由
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/sublt', component: User }
    // { path: '/worker', component: Worker }
  ]
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})


