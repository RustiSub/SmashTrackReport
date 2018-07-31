<template>
    <div class="time-line">
        <span class="btn btn-light time-line-bookmark time-line-begin" v-on:click="clickTimeLineBookmark('begin')">
            <font-awesome-icon icon="hourglass-start"></font-awesome-icon>
        </span>

        <template v-for="(bookmark, bookmarkIndex) in bookmarks[match.match.id]['player']">
            <template v-for="(playerBookmark, playerBookmarkIndex) in bookmark">
                <time-line-bookmark-button
                    :timeStamp="playerBookmark"
                    :begin="bookmarks[match.match.id]['begin']"
                    :end="bookmarks[match.match.id]['end']"
                >
                    <img v-bind:src=mapCharacterStockIcon(match.players[bookmarkIndex].character.name)
                         v-bind:title="match.players[bookmarkIndex].character.name"
                         v-bind:alt="match.players[bookmarkIndex].character.name" width="20" height="20"
                    />
                </time-line-bookmark-button>
            </template>
            <!--<span v-for="(stock, stockIndex) in stocksToArray(match.match.stocks - player.data.stocks)"-->
                  <!--class="time-line-bookmark"-->
                  <!--v-bind:style="timeLineBookmark(match, player.id, stockIndex + 1)"-->
            <!--&gt;-->
                <!--<button class="btn btn-light" value="Stock" v-on:click="playerSeekTimeStamp(seekStockTimeStamp(match, player, stockIndex + 1))">-->
                    <!--<img v-bind:src=mapCharacterStockIcon(player.character.name)-->
                         <!--v-bind:title="player.character.name + ' - ' + player.data.stocks"-->
                         <!--v-bind:alt="player.character.name" width="20" height="20"/>-->
                <!--</button>-->
            <!--</span>-->
        </template>

        <span class="btn btn-light time-line-bookmark time-line-end" v-on:click="clickTimeLineBookmark('end')">
            <font-awesome-icon icon="hourglass-end"></font-awesome-icon>
        </span>
    </div>
</template>
<script>
  import TimeLineBookmarkButton from './TimeLineBookmarkButton.vue';

  export default {
    name: 'TimeLine',
    components: {
      TimeLineBookmarkButton
    },
    data: function () {
      return {
      }
    },
    props: {
      match: Object,
      bookmarks: Object
    },
    methods: {
      mapCharacterStockIcon: function (characterName) {
        return require("../assets/characters/" + characterName.toLowerCase().trim().replace(/\s/g, "").replace(".", "") + ".png");
      },
      clickTimeLineBookmark: function(name) {
        this.$emit('time-line-bookmark-click', {
          name: name,
          matchId: this.match.match.id
        });
      }
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .time-line-bookmark {
        position: absolute;
    }
    .time-line-begin {
        left: 0;
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
        top: 20px;
    }
</style>
