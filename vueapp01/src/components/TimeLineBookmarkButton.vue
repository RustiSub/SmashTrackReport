<template>
    <span class="btn btn-light time-line-bookmark"
          v-bind:style="timeLineBookmark"
          v-on:click="clickTimeLineBookmark"
    >
        <slot></slot>
    </span>
</template>
<script>
  export default {
    name: 'TimeLineBookmarkButton',
    props: {
      bookMark: Object,
      begin: Number,
      end: Number,
    },
    computed: {
      timeLineBookmark: function() {
        let duration = this.end - this.begin;
        let width = this.bookMark['timestamp'] * ((1000 - 48) / duration);

        return {
          'left': width + 'px',
        };
      }
    },
    methods: {
      clickTimeLineBookmark: function(event) {
        this.$emit('time-line-bookmark-click', {});
      },
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
