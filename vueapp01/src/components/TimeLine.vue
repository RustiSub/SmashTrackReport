<template>
    <div class="time-line">
        <h1>{{ match.begin}}</h1>
        <time-line-bookmark-button class="time-line-begin" @click="bookmarkClicked()">
            <font-awesome-icon icon="hourglass-start"></font-awesome-icon>
        </time-line-bookmark-button>

        <time-line-bookmark-button class="time-line-end">
            <font-awesome-icon icon="hourglass-end"></font-awesome-icon>
        </time-line-bookmark-button>
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
      bookmarks: Object,
      match: Object,
      title: String
    },
    methods: {
      bookmarkClicked: function() {
        console.log(this.bookmarks);
      }
    },
    mounted() {
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
