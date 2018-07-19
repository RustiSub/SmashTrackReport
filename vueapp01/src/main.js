// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

let calculatePlayerStats = function(matches, users) {
  Array.from(users).forEach(function(user) {
    user.games = 0;
    user.wins = 0;
    user.losses = 0;
    user.winRatio = 0;
    user.stocksTaken = 0;
    user.stocksTakenRatio = 0;
    user.stocksLost = 0;
    user.stocksLostRatio = 0;

    user.matchesPlayed = [];
    user.characters = [];

    Array.from(matches).forEach(function(matchData) {
      Array.from(matchData.players).forEach(function(player) {
        if (player.user.id === user.id) {
          user.matchesPlayed.push(matchData);

          if(!user.characters.hasOwnProperty(player.character.name)){
            user.characters[player.character.name] = player.character;
          }

          let character = user.characters[player.character.name];

          character.games = 0;
          character.wins = 0;
          character.losses = 0;
          character.winRatio = 0;
          character.stocksTaken = 0;
          character.stocksTakenRatio = 0;
          character.stocksLost = 0;
          character.stocksLostRatio = 0;
        }
      });
    });

    Array.from(user.matchesPlayed).forEach(function(matchPlayedData) {
      Array.from(matchPlayedData.players).forEach(function(player) {
        let character = user.characters[player.character.name];

        if (player.user.id === user.id) {
          if (player.is_winner) {
            user.wins += 1;
            character.wins += 1;
          } else {
            user.losses += 1;
            character.losses += 1;
          }

          user.games += 1;
          character.games += 1;

          user.stocksLost += matchPlayedData.match.stocks - player.data.stocks;
          character.stocksLost += matchPlayedData.match.stocks - player.data.stocks;
        } else {
          user.stocksTaken += matchPlayedData.match.stocks - player.data.stocks;
        }
      });
    });

    if (!user.games) {
      return;
    }
    user.winRatio = (user.wins / user.games).toFixed(3);
    user.stocksTakenRatio = (user.stocksTaken / user.games).toFixed(3);
    user.stocksLostRatio = (user.stocksLost / user.games).toFixed(3);
  });

  return users;
};

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

        self.users = calculatePlayerStats(self.matches, self.users);



        return self.matches;
      });
    });
  }
})
