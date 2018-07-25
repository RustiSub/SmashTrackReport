<template>
    <div class="leaderboard">
        <h3>Leaderboard</h3>
        <table class="table table-striped">
            <thead class="thead-dark">
            <tr>
                <th @click="toggleCharacters">+</th>
                <th>Player</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Avg Win</th>
                <th>Stocks Lost</th>
                <th>Avg Stocks Lost</th>
                <th>Stocks Taken</th>
                <th>Avg Stocks Taken</th>
            </tr>
            </thead>
            <template v-for="user in users">
                <tr class="table-primary">
                    <td></td>
                    <td>{{ user.tag }}</td>
                    <td>{{ user.games }}</td>
                    <td>{{ user.wins }}</td>
                    <td>{{ user.losses }}</td>
                    <td>{{ user.winRatio }}</td>
                    <td>{{ user.stocksLost }}</td>
                    <td>{{ user.stocksLostRatio }}</td>
                    <td>{{ user.stocksTaken }}</td>
                    <td>{{ user.stocksTakenRatio }}</td>
                </tr>
                <template v-for="character in user.characters">
                    <tr :class="[user.tag]" v-show="showCharacters">
                        <td></td>
                        <td>{{ character.name }}</td>
                        <td>{{ character.games }}</td>
                        <td>{{ character.wins }}</td>
                        <td>{{ character.losses }}</td>
                        <td>{{ ratio(character.wins, character.games) }}</td>
                        <td>{{ character.stocksLost }}</td>
                        <td>{{ ratio(character.stocksLost, character.games) }}</td>
                        <td>{{ character.stocksTaken }}</td>
                        <td>{{ ratio(character.stocksTaken, character.games) }}</td>
                    </tr>
                </template>
            </template>
        </table>
        <h3>Matches</h3>
        <table class="table">
            <thead class="thead-dark">
            <tr>
                <th>Date</th>
                <!--<th>Matchup</th>-->
                <th>Result</th>
                <th>Stage</th>
            </tr>
            </thead>
            <template v-for="match in sortedMatchesByDate">
                <tr>
                    <td style="vertical-align: middle">
                        {{ match.match.date | formatDate }}
                    </td>
                    <td style="vertical-align: middle">
                        <table style="margin:auto; width:50%" class="table-borderless table-sm table-result">
                            <tr>
                                <template v-for="(player, index) in match.players">
                                    <td class="col-player">
                                        <span v-bind:class="{'font-weight-bold': player.is_winner}">
                                            {{ player.user.tag }}
                                        </span>
                                    </td>
                                    <td class="col-stocks">
                                        <span v-for="stock in stocksToArray(player.data.stocks)">
                                                <img v-bind:class="{ 'stock-loser': !player.is_winner}"
                                                     v-bind:src=mapCharacterStockIcon(player.character.name)
                                                     v-bind:title="player.character.name + ' - ' + player.data.stocks"
                                                     v-bind:alt="player.character.name" width="20" height="20"/>
                                            </span>
                                        <span v-if="player.data.stocks == 0">
                                                <img v-bind:class="{ 'stock-loser': !player.is_winner}"
                                                     v-bind:src=mapCharacterStockIcon(player.character.name)
                                                     v-bind:title="player.character.name + ' - ' + player.data.stocks"
                                                     v-bind:alt="player.character.name" width="20" height="20"/>
                                            </span>
                                    </td>
                                    <td class="col-vs" v-if="index != match.players.length - 1"> vs </td>
                                </template>
                            </tr>
                        </table>
                    </td>
                    <td style="vertical-align: middle">
                        {{ match.match.stage.name }}
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>
<script>
  import axios from 'axios';
  import moment from 'moment';

  let calculatePlayerStats = function (self) {
    let matches = self.matches;
    let users = self.users;

    Array.from(users).forEach(function (user) {
      user.games = 0;
      user.wins = 0;
      user.losses = 0;
      user.winRatio = 0;
      user.stocksTaken = 0;
      user.stocksTakenRatio = 0;
      user.stocksLost = 0;
      user.stocksLostRatio = 0;

      user.matchesPlayed = [];
      user.characters = {};

      Array.from(matches).forEach(function (matchData) {
        Array.from(matchData.players).forEach(function (player) {
          if (player.user.id === user.id) {
            user.matchesPlayed.push(matchData);

            if (!user.characters[player.character.name]) {
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

      Array.from(user.matchesPlayed).forEach(function (matchPlayedData) {
        let character;
        matchPlayedData.stocksTaken = 0;
        Array.from(matchPlayedData.players).forEach(function (player) {
          if (player.user.id === user.id) {
            character = user.characters[player.character.name];

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

            matchPlayedData.stocksTaken += matchPlayedData.match.stocks - player.data.stocks;
          }
        });
        character.stocksTaken += matchPlayedData.stocksTaken;
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

  export default {
    name: 'leaderboard',
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('MM/DD/YYYY')
        }
      }
    },
    methods: {
      toggleCharacters() {
        this.showCharacters = !this.showCharacters;
      },
      ratio: function (number, total) {
        return (number / total).toFixed(3);
      },
      mapCharacterStockIcon: function (characterName) {
        return require("../assets/icons/" + characterName.trim().replace(/\s/g, "").replace(".", "") + ".png");
      },
      stocksToArray: function(numberOfStocks) {
        var stocks = [];

        for (var i = 0; i < numberOfStocks; i++) {
          stocks.push(i);
        }

        return stocks;
      }
    },
    data: function () {
      return {
        matches: [],
        users: [],
        showCharacters: false
      }
    },
    computed: {
      sortedMatchesByDate: function () {
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
    mounted() {
      let self = this;

      self.$http.post('https://smashtrack.benn0.be/login', {
        tag: 'WPIT',
        password: 'WPIT'
      }, {
        headers: {
          'Content-type': 'application/json',
        },
        withCredentials: true
      }).then((response) => {
        self.$http.get('https://smashtrack.benn0.be/users', {
          headers: {
            'Content-type': 'application/json',
          },
          withCredentials: true
        }).then(usersResponse => {
          self.users = usersResponse.data.data;
        });

        self.$http.get('https://smashtrack.benn0.be/matches', {
          headers: {
            'Content-type': 'application/json',
          },
          withCredentials: true
        }).then(matchesResponse => {
          self.matches = matchesResponse.data.data;
          calculatePlayerStats(self);
        });
      });
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .table-result {
        table-layout: fixed;
        width: 100px;
        border: none;
    }
    .col-player {
        width: 40px;
    }
    .col-vs {
        width: 50px;
    }
    .col-stocks {
        width: 20px;
    }
    .stock-loser {
        opacity: 0.5;
    }
</style>
