// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './../static/css/reset.css'
import QS from 'qs'
import axios from 'axios'

Vue.config.productionTip = false

var http = axios.create({
  // baseURL: 'http://47.111.123.89:9001',
});

Vue.prototype.$http = http;
Vue.prototype.$http.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = QS.stringify(config.data);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


const components = [
];
//全局组件注册
components.map(component => {
  Vue.component(component.name, component);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
