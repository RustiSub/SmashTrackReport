<template>
  <div id="app">
    <h1>Smacker</h1>
    <img src="./assets/SmashBall.svg">
    <leader-board></leader-board>
  </div>
</template>
<script>
  import LeaderBoard from './components/Leaderboard.vue';
  import BookmarkButton from './components/BookmarkButton.vue';
  import TimeLine from './components/TimeLine.vue';

  export default {
    name: 'app',
    components: {
      LeaderBoard,
      BookmarkButton,
    }
  }
</script>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
