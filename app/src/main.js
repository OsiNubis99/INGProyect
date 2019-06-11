import Vue from 'vue';
import App from './App';
import '@babel/polyfill';
import axios from 'axios'
import './plugins/vuetify';
import store from './store';
import VueAxios from 'vue-axios';
import router from './router.js';
import '@fortawesome/fontawesome-free/css/all.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios)

/* eslint-disable no-new */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')