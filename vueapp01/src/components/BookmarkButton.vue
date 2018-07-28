<template>
    <span class="bookmark-button btn btn-light" v-on:click="clickBookmark()">
        <slot></slot>
    </span>
</template>
<script>
  export default {
    name: 'bookmarkButton',
    props: {
      bookmarkName: String,
      playerId: Number,
      stockNumber: Number
    },
    methods: {
      clickBookmark: function() {
        this.$emit('bookmark-click', {
          name: this.bookmarkName,
          playerId: this.playerId,
          stockNumber: this.stockNumber
        });
      }
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
