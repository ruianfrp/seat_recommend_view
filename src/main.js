// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '../config/axios'
import promise from 'es6-promise'
import store from './store/index'
import '../css/font-awesome.min.css'
import '../css/style1.css'
import '../css/style.css'
promise.polyfill()
Vue.use(ElementUI)
Vue.config.productionTip = false


axios.defaults.baseURL= 'http://127.0.0.1:5000'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true
// axios.defaults.headers.common['Authorization'] = store.state.token
Vue.prototype.$axios = axios


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});