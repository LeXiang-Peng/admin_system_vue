import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './router/manageRoute'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/globle.css'
import request from './utils/request';
import VueCookies from "vue-cookies";
import $  from 'jquery';
import store from './store';


Vue.prototype.jquery = $

Vue.config.productionTip = false

Vue.use(ElementUI, {size: "mini" });

Vue.prototype.request = request

Vue.use(VueCookies);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
