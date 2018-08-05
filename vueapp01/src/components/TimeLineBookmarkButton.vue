<template>
    <span class="btn btn-light time-line-bookmark"
          v-bind:style="timeLineBookmark"
          v-on:click="clickTimeLineBookmark"
    >
        <slot></slot>
        <span class="time-line-bookmark-time">{{ formattedTime }}</span>
    </span>
</template>
<script>
  import moment from 'moment';
  import momentFormat from 'moment-duration-format';

  export default {
    name: 'TimeLineBookmarkButton',
    props: {
      bookMark: Object,
      begin: Number,
      end: Number,
      level: 0,
    },
    computed: {
      timeLineBookmark: function() {
        let duration = this.end - this.begin;
        let time = this.bookMark['timestamp'] - this.begin;

        let width = time * ((1000 - 88) / duration);

        return {
          'left': width + 'px',
        };
      },
      formattedTime: function() {
        let seconds = this.bookMark['timestamp'] - this.begin;
        let duration = moment.duration(seconds, 'seconds');

        return  duration.format("mm:ss", {
          trim: false
        });
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
    .time-line-bookmark-time {
        position: absolute;
        top: 40px;
        left: 2px;
    }
</style>
