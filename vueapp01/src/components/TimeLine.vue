<template>
    <div class="time-line">
        <div class="time-line-controls">
            <div class="time-line-control-buttons">
                <span @click="pauseVideo">
                    <font-awesome-icon icon="step-backward"></font-awesome-icon>
                </span>

                <span @click="pauseVideo"
                      class="time-line-control-cursor"
                >
                    <font-awesome-icon icon="play"></font-awesome-icon>
                </span>

                    <span @click="skipFrame">
                    <font-awesome-icon icon="step-forward"></font-awesome-icon>
                </span>
            </div>
        </div>

        <div>
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

                <span v-bind:style="timeLineCursor"
                      @mouseover="hoverCursor"
                      @mouseout="hoverCursorOut"
                      @click="pauseVideo"
                      class="time-line-cursor"
                >
                <font-awesome-icon icon="play" v-if="cursorDisplay(!this.cursorHover)"></font-awesome-icon>
                <font-awesome-icon icon="pause" v-if="cursorDisplay(this.cursorHover)"></font-awesome-icon>
            </span>
        </div>
    </div>
</template>
<script>
  import TimeLineBookmarkButton from './TimeLineBookmarkButton.vue';
  import moment from 'moment';
  import momentFormat from 'moment-duration-format';

  export default {
    name: 'TimeLine',
    components: {
      TimeLineBookmarkButton
    },
    data: function () {
      return {
        cursorHover: false
      }
    },
    props: {
      match: Object,
      bookmarks: Object,
      currentTime: Object,
      playing: Boolean
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
      cursorDisplay: function(hover) {
        if (this.playing) {
          return hover;
        } else {
          return !hover;
        }
      },
      skipFrame: function(event) {
        this.$emit('time-line-next-frame-click');
      },
      pauseVideo: function(event) {
        this.$emit('time-line-cursor-click');
      },
      hoverCursor: function(event) {
        this.cursorHover = true;
      },
      hoverCursorOut: function(event) {
        this.cursorHover = false;
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
    .time-line-controls {
        width: 100%;
        margin: 0 auto;
    }
    .time-line-control-buttons {
        display: table;
        margin: 0 auto;
    }
    .time-line-control-cursor {
    }
</style>
