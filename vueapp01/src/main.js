import Vue from 'vue'
import App from './App'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
