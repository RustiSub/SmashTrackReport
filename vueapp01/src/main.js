import Vue from 'vue'
import App from './App'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import LoadScript from 'vue-plugin-load-script'
import VModal from 'vue-js-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import { faHourglassEnd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueYouTubeEmbed from 'vue-youtube-embed'

library.add(faEye);
library.add(faHourglassStart);
library.add(faHourglassEnd);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueYouTubeEmbed);
Vue.use(VModal);
Vue.use(LoadScript);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
