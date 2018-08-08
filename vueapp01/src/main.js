import Vue from 'vue'
import App from './App'
import axios from 'axios'
import 'moment-duration-format'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStepBackward } from '@fortawesome/free-solid-svg-icons'
import { faStepForward } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import { faHourglassEnd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueYouTubeEmbed from 'vue-youtube-embed'

library.add(faStepBackward);
library.add(faStepForward);
library.add(faPause);
library.add(faPlay);
library.add(faTrash);
library.add(faFolderOpen);
library.add(faSave);
library.add(faEye);
library.add(faHourglassStart);
library.add(faHourglassEnd);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueYouTubeEmbed);
Vue.use(VModal);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
