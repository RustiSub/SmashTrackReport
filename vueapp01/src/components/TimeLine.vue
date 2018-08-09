<template>
    <div class="time-line">
        <div class="time-line-damage-chart">
            <damage-chart></damage-chart>
        </div>
        <span class="btn btn-light time-line-bookmark time-line-begin" v-on:click="clickTimeLineBookmark(bookmarks[match.match.id]['begin'])">
            <font-awesome-icon icon="hourglass-start"></font-awesome-icon>
            <span class="time-line-bookmark-time">{{ formattedTime(bookmarks[match.match.id]['begin']) }}</span>
        </span>

        <template v-for="(bookmark, bookmarkIndex) in bookmarks[match.match.id]['player']">
            <template v-for="(playerBookmark, key) in bookmark">
                <time-line-bookmark-button
                    :bookMark="playerBookmark"
                    :begin="bookmarks[match.match.id]['begin']"
                    :end="bookmarks[match.match.id]['end']"
                    v-on:time-line-bookmark-click="clickTimeLineBookmark(playerBookmark['timestamp'])">
                    <img v-bind:src=mapCharacterStockIcon(match.players[bookmarkIndex].character.name)
                         v-bind:title="match.players[bookmarkIndex].character.name"
                         v-bind:alt="match.players[bookmarkIndex].character.name" width="20" height="20"
                    />
                </time-line-bookmark-button>
            </template>
        </template>

        <span class="btn btn-light time-line-bookmark time-line-end" v-on:click="clickTimeLineBookmark(bookmarks[match.match.id]['end'])">
            <font-awesome-icon icon="hourglass-end"></font-awesome-icon>
            <span class="time-line-bookmark-time">{{ formattedTime(bookmarks[match.match.id]['end']) }}</span>
        </span>

        <span v-bind:style="timeLineCursor" class="time-line-cursor">
            <font-awesome-icon icon="play"></font-awesome-icon>
        </span>
    </div>
</template>
<script>
  import TimeLineBookmarkButton from './TimeLineBookmarkButton.vue';
  import moment from 'moment';
  import momentFormat from 'moment-duration-format';
  import DamageChart from './DamageChart.js'

  export default {
    name: 'TimeLine',
    components: {
      TimeLineBookmarkButton,
      DamageChart
    },
    data: function () {
      return {
      }
    },
    props: {
      match: Object,
      bookmarks: Object,
      currentTime: Object
    },
    computed: {
      timeLineCursor: function () {
        let begin = this.bookmarks[this.match.match.id]['begin'];
        let end = this.bookmarks[this.match.match.id]['end'];
        let duration = end - begin;
        let time = this.currentTime.time - begin;

        let width = time * ((1000 - 88) / duration);

        return {
          'left': width + 'px',
        };
      },
    },
    methods: {
      bookmarksOverlap: function(mainBookmark) {
        let playerBookmarks = this.bookmarks[this.match.match.id]['player'];

        for (let playerBookmarkIndex in playerBookmarks) {
          if (playerBookmarks.hasOwnProperty(playerBookmarkIndex)) {
            let playerBookmarks = playerBookmarks[playerBookmarkIndex];

            console.log(playerBookmarks);
          }
        }

        Array.from(this.bookmarks[this.match.match.id]).forEach(function (overlappingBookMark) {
          console.log(overlappingBookMark);
          if( mainBookmark !== overlappingBookMark) {
            if( mainBookmark > overlappingBookMark) {
              if( mainBookmark < overlappingBookMark + 1000) {
                console.log(mainBookmark);
              }
            }
          }
        });
      },
      mapCharacterStockIcon: function (characterName) {
        return require("../assets/characters/" + characterName.toLowerCase().trim().replace(/\s/g, "").replace(".", "") + ".png");
      },
      clickTimeLineBookmark: function(timestamp) {
        this.$emit('time-line-bookmark-click', {
          timestamp: timestamp
        });
      },
      formattedTime: function(seconds) {
        seconds = seconds - this.bookmarks[this.match.match.id]['begin'];
        var duration = moment.duration(seconds, 'seconds');

        return  duration.format("mm:ss", {
          trim: false
        });
      }
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .time-line-cursor {
        position: absolute;
        top: 8px;
        margin-left: 15px;
    }
    .time-line-bookmark {
        position: absolute;
        opacity: 0.90;
        top: 30px;
    }
    .time-line-begin {
        left: 0px;
    }
    .time-line-end {
        right: 0px;
    }
    .time-line {
        position: relative;
    }
    .time-line::before {
        content: '';
        display: block;
        height: 1px;
        background-color: #000;
        position: absolute;
        left: 0;
        right: 0;
        top: 18px;
    }
    .time-line-bookmark-time {
        position: absolute;
        top: 40px;
        left: -2px;
    }
</style>
