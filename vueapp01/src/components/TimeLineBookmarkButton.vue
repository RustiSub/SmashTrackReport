<template>
    <span class="btn btn-light time-line-bookmark" v-bind:style="timeLineBookmark">
        <slot></slot>
    </span>
</template>
<script>
  export default {
    name: 'TimeLineBookmarkButton',
    props: {
      timeStamp: Number,
      begin: Number,
      end: Number,
    },
    computed: {
      timeLineBookmark: function() {
        let duration = this.end - this.begin;
        let width = this.timeStamp * (1000 / duration);

        return {
          'left': width + 'px',
        };
      }
    },
    methods: {
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
