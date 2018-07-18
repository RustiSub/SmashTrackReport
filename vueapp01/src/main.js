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
    matches: [],
    users: [],
  },
  computed: {
    sortedMatchesByDate: function() {
      function compare(a, b) {
        if (moment(a.match.date).isBefore(moment(b.match.date)))
          return 1;
        if (moment(a.match.date).isAfter(moment(b.match.date)))
          return -1;
        return 0;
      }

      return this.matches.sort(compare);
    },
    playerStats: function() {

    }
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
      axios.get('https://smashtrack.benn0.be/users', {
        headers: {
          'Content-type': 'application/json',
        },
        withCredentials: true
      }).then(usersResponse => {
        self.users = usersResponse.data.data;

        return self.users;
      });

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
