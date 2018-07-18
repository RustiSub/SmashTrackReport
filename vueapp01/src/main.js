// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
/*import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'*/
import moment from 'moment'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    matches: []
  },
  created() {
    let self = this;

    axios.post('https://smashtrack.benn0.be/login', {
      tag: 'WPIT',
      password: 'WPIT'
    }, {
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true
    }).then((response) => {
      axios.get('https://smashtrack.benn0.be/matches', {
        headers: {
          'Content-type': 'application/json',
        },
        withCredentials: true
      }).then(matchesResponse => {
        self.matches = matchesResponse.data.data;

        return self.matches;
      });
    });
  }
})
