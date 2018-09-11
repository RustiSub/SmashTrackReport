<template>
    <div class="leaderboard">
        <modal name="modal-match-player" @before-open="beforeOpen" @before-close="beforeClose" :width="1000" :height="720">
            <div id="replayPlayerWindow">
                <span class="font-weight-bold">VideoId: </span>
                <input v-model="videoId" placeholder="Youtube Video Id">
                <div class="replay-container">
                    <youtube :video-id="videoId"
                             :playerWidth="1000"
                             :playerHeight="500"
                             @ready="playerReady"
                             @playing="startCursor"
                             @paused="stopCursor"
                             @ended="stopCursor"
                    ></youtube>
                </div>
                <div class="time-line-bookmarks">
                    <div class="time-line-bookmark-control">
                        <bookmark-button v-bind:bookmark-name="'begin'"
                                         v-bind:match="playingMatch.match"
                                         v-on:bookmark-click="placeGlobalBookmark" >
                            <font-awesome-icon icon="hourglass-start"></font-awesome-icon>
                        </bookmark-button>

                        <template v-for="(player, index) in playingMatch.players">
                            <template v-for="(stock, stockIndex) in stocksToArray(playingMatch.match.stocks - player.data.stocks)">
                                <bookmark-button
                                    v-bind:bookmark-name="'player'"
                                    v-bind:match="playingMatch.match"
                                    v-bind:player-id="player.id"
                                    v-bind:stock-number="stockIndex + 1"
                                    v-on:bookmark-click="placeGlobalBookmark"
                                >
                                    <img v-bind:src=mapCharacterStockIcon(player.character.name)
                                         v-bind:title="player.character.name + ' - ' + player.data.stocks"
                                         v-bind:alt="player.character.name" width="20" height="20"/>
                                </bookmark-button>
                            </template>
                        </template>

                        <bookmark-button
                                v-bind:bookmark-name="'end'"
                                v-bind:match="playingMatch.match"
                                v-on:bookmark-click="placeGlobalBookmark"
                        >
                            <font-awesome-icon icon="hourglass-end"></font-awesome-icon>
                        </bookmark-button>
                    </div>
                </div>
                <time-line v-bind:match="playingMatch"
                           v-bind:bookmarks="bookmarks"
                           v-bind:currentTime="videoCurrentTime"
                           v-on:time-line-bookmark-click="seekBookmark">

                </time-line>
            </div>
        </modal>
        <h3>Leaderboard</h3>
        <table class="table">
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
            <template v-for="user in sortUserByGames(users)">
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
                <template v-for="character in sortUserCharactersByGames(user.characters)">
                    <tr :class="[user.tag]" v-show="showCharacters">
                        <td></td>
                        <td>
                            <img v-bind:src=mapCharacterStockIcon(character.name)
                                 v-bind:title="character.name"
                                 v-bind:alt="character.name" width="30" height="30"/>
                        </td>

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
        <table class="table table-striped">
            <thead class="thead-dark">
            <tr>
                <th>Date</th>
                <th>Result</th>
                <th>Stage</th>
            </tr>
            </thead>
            <tr>
                <td colspan="3">
                    <span class="btn save-icon" @click="downloadBookmarks()"><font-awesome-icon icon="save"></font-awesome-icon></span>
                    <input type="file" id="file-input" />
                    <span class="btn open-icon" @click="openBookmarks()"><font-awesome-icon icon="folder-open"></font-awesome-icon></span>
                    <span class="btn delete-icon" @click="clearBookmarks()"><font-awesome-icon icon="trash"></font-awesome-icon></span>
                </td>
            </tr>
            <template v-for="match in sortedMatchesByDate">
                <tr>
                    <td style="vertical-align: middle">
                        {{ match.match.date | formatDate }}
                    </td>
                    <td style="vertical-align: middle">
                        <table style="margin:auto; width:50%" class="table-borderless table-sm table-result">
                            <tr>
                                <template v-for="(player, key, index) in match.players">
                                    <td class="col-player" style="vertical-align: middle">
                                        <span v-bind:class="{'font-weight-bold': player.is_winner}">
                                            {{ player.user.tag }}
                                        </span>
                                    </td>
                                    <td class="col-stocks" style="vertical-align: middle">
                                        <span v-for="(stock, stockIndex) in stocksToArray(match.match.stocks)">
                                            <img v-bind:class="{ 'stock-lost': player.data.stocks <= stockIndex}"
                                                 v-bind:src=mapCharacterStockIcon(player.character.name)
                                                 v-bind:title="player.character.name + ' - ' + player.data.stocks"
                                                 v-bind:alt="player.character.name" width="20" height="20"/>
                                        </span>
                                    </td>
                                    <td class="col-vs" v-if="index != playerCount(match.players) - 1" style="vertical-align: middle"> vs </td>
                                </template>
                                <td class="col-vs" style="vertical-align: middle">
                                    <button v-on:click="show(match)" title="Watch VOD" class="btn btn-light"
                                        v-bind:class="{'no-video': !hasVideo(match.match.id)}"
                                    >
                                        <font-awesome-icon icon="eye"></font-awesome-icon>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="vertical-align: middle;width: 224px;">
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
  import BookmarkButton from "./BookmarkButton.vue";
  import TimeLineBookmarkButton from "./TimeLineBookmarkButton.vue";
  import TimeLine from "./TimeLine.vue";

  let calculatePlayerStats = function (self) {
    let matches = self.matches;
    let users = self.users;

    Array.from(matches).forEach(function(match) {
      let players = {};

      Array.from(match.players).forEach(function(player) {
        players[player.id] = player;
      });

      match.players = players;
    });

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
        for (var playerIndex in matchData.players) {
          if (matchData.players.hasOwnProperty(playerIndex)) {
            let player = matchData.players[playerIndex];
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
          }
        }
      });

      Array.from(user.matchesPlayed).forEach(function (matchPlayedData) {
        let character;
        matchPlayedData.stocksTaken = 0;

        for (var playerIndex in matchPlayedData.players) {
          if (matchPlayedData.players.hasOwnProperty(playerIndex)) {
            let player = matchPlayedData.players[playerIndex];

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
          }
        }

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

  let player;

  export default {
    name: 'leaderboard',
    components: {
      TimeLine,
      TimeLineBookmarkButton,
      BookmarkButton
    },
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('MM/DD/YYYY')
        }
      }
    },
    methods: {
      clearBookmarks: function() {
        localStorage.setItem('bookmarks_backup_' + moment().format('YYYY-MM-DDHH:m'), this.bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify({}));

        this.initBookMarks();
      },
      openBookmarks: function() {
        var self = this;
        var file = document.getElementById('file-input').files[0];

        var reader = new FileReader();
        reader.onload = function(e) {
          localStorage.setItem('bookmarks_backup_' + moment().format('YYYY-MM-DDHH:m'), this.bookmarks);
          localStorage.setItem('bookmarks', JSON.stringify(JSON.parse(e.target.result)));

          self.initBookMarks();
        };
        reader.readAsText(file);
      },
      downloadBookmarks: function() {
          let filename = 'smacker-bookmarks.json';
          let text = JSON.stringify(this.bookmarks);
          let  element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          element.setAttribute('download', filename);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
      },
      hasVideo: function(matchId) {
        let video = this.bookmarks[matchId] || false;

        video = video['videoId'] || false;
        video = video && video !== '';

        return video;
      },
      toggleCharacters() {
        this.showCharacters = !this.showCharacters;
      },
      ratio: function (number, total) {
        return (number / total).toFixed(3);
      },
      mapCharacterStockIcon: function (characterName) {
        try {
          return require("../assets/characters/" + characterName.toLowerCase().trim().replace(/\s/g, "").replace(".", "") + ".png");
        } catch (e) {
          return '';
        }
      },
      playerCount: function(players) {
        return Object.keys(players).length;
      },
      stocksToArray: function(numberOfStocks) {
        var stocks = [];

        //TODO: Use actual timestamps from MetaData
        for (var i = 0; i < numberOfStocks; i++) {
          stocks.push({
            timeStamp: 120,
          });
        }

        return stocks;
      },
      sortUserByGames: function (users) {
        function compare(a, b) {
          if (a.wins > b.wins)
            return -1;
          if (a.wins < b.wins)
            return 1;

          if (a.losses > b.losses)
            return 1;
          if (a.losses < b.losses)
            return -1;

          if (a.games > b.games)
            return -1;
          if (a.games < b.games)
            return 1;

          return 0;
        }

        if (!users) {
          return [];
        }

        let sortable = [];

        for (let key in users) {
          if (users.hasOwnProperty(key)) {
            sortable.push(users[key]);
          }
        }

        return sortable.sort(compare);
      },
      sortUserCharactersByGames: function (characters) {
        function compare(a, b) {
          if (a.games > b.games)
            return -1;
          if (a.games < b.games)
            return 1;

          if (a.wins > b.wins)
            return -1;
          if (a.wins < b.wins)
            return 1;

          if (a.losses > b.losses)
            return 1;
          if (a.losses < b.losses)
            return -1;

          return 0;
        }

        if (!characters) {
          return [];
        }

        let sortable = [];

        for (let key in characters) {
          if (characters.hasOwnProperty(key)) {
            sortable.push(characters[key]);
          }
        }

        return sortable.sort(compare);
      },
      playerReady: function(event) {
        self.videoPlayer = event.target;

        self.videoPlayer.mute();
        self.videoPlayer.seekTo(this.bookmarks[this.matchId]['begin']);
      },
      stopCursor: function(event) {
        clearInterval(this.videoTimerId);
      },
      startCursor: function(event){
        this.videoTimerId = setInterval(function() {
          this.videoCurrentTime.time = self.videoPlayer.getCurrentTime();
        }.bind(this), 100);
      },
      offline: function(event) {
        this.feedLive = false;
      },
      initBookMarks: function() {
        this.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));

        return this.bookmarks;
      },
      initMatchBookMarks: function(matchId, players) {
        this.bookmarks[matchId] = this.bookmarks[matchId] || {};

        this.bookmarks[matchId]['videoId'] = this.bookmarks[matchId]['videoId'] || '';
        this.bookmarks[matchId]['begin'] = this.bookmarks[matchId]['begin'] || 0;
        this.bookmarks[matchId]['end'] = this.bookmarks[matchId]['end'] || 0;
        this.bookmarks[matchId]['player'] = this.bookmarks[matchId]['player'] || {};

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));

        return this.bookmarks;
      },
      seekBookmark: function(event) {
        self.videoPlayer.seekTo(event.timestamp);
      },
      placeGlobalBookmark: function(event) {
        let timestamp = self.videoPlayer.getCurrentTime();
        let name = event.name;
        let matchId = event.matchId;
        let playerId = event.playerId;
        let stockNumber = event.stockNumber;

        this.bookmarks[matchId] = this.bookmarks[matchId] || {};

        if (!playerId){
          this.bookmarks[matchId][name] = timestamp;
        } else if (!stockNumber) {
          this.bookmarks[matchId][name] = this.bookmarks[matchId][name] || {};
          this.bookmarks[matchId][name][playerId] = timestamp;
        } else {
          this.bookmarks[matchId][name] = this.bookmarks[matchId][name] || {};
          this.bookmarks[matchId][name][playerId] = this.bookmarks[matchId][name][playerId]  || {};
          this.bookmarks[matchId][name][playerId][stockNumber] = {
            timestamp: timestamp
          };

          if (this.bookmarks[matchId]['begin'] > timestamp) {
            this.bookmarks[matchId]['begin'] = timestamp;
          }

          if (this.bookmarks[matchId]['end'] < timestamp) {
            this.bookmarks[matchId]['end'] = timestamp;
          }
        }

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
      },
      show (match, stockIndex) {
        this.$modal.show('modal-match-player',
            {
              match: match,
              videoId: '',
            }
        );
      },
      hide () {
        this.$modal.hide('modal-match-player');
      },
      beforeClose(event) {
        this.stopCursor(event);
      },
      beforeOpen(event) {
        this.playingMatch = event.params.match;

        this.initMatchBookMarks(this.playingMatch.match.id, this.playingMatch.players);

        this.matchId = this.playingMatch.match.id;
        this.videoId = this.bookmarks[this.playingMatch.match.id]['videoId'];
      }
    },
    data: function () {
      return {
        matches: [],
        users: [],
        showCharacters: false,
        matchId: null,
        videoId: '',
        playingMatch: {},
        player: {},
        playerWidth: 0,
        bookmarks: {},
        feedLive: false,
        videoTimerId: null,
        videoCurrentTime: {
          time: 0
        }
      }
    },
    watch: {
      videoId: function() {
        this.bookmarks[this.matchId]['videoId'] = this.videoId;

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
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

      this.initBookMarks();

      self.$http.post('https://smashtrack.benn0.be/login', {
        tag: 'smackerboard',
        password: '$2b$12$3v9P7U55Vr.ooknBPlaaMes7DFeJHSEKYiNEcxB1V7kccn9Im9XJ6'
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

        self.$http.get('https://smashtrack.benn0.be/matches?pageSize=1000', {
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
        width: 10px;
    }
    .col-stocks {
        width: 50px;
    }
    .save-icon {

    }
    .no-video {
        opacity: 0.5;
    }
    .stock-loser {
        opacity: 0.5;
    }
    .stock-lost {
        opacity: 0.25;
    }
    .replay-container {
        width: 100%;
        margin: 0 auto;
    }
    .time-line-bookmarks {
        width: 100%;
        margin: 0 auto;
    }
    .time-line-bookmark-control {
        display: table;
        margin: 0 auto;
    }
</style>
