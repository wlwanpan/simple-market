<template>
  <div id="app">
    <h1> Simple Market </h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',

  mounted: function () {
    // Store Contract Instance Address in config file
    this.$store.dispatch('initContractInstance', {address: '0xd3a0469ac632f8e3f66ee4a63726df2d5a0c60dd'})
    this.$store.dispatch('initCoinbaseAddress')
  }

}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  h1 {
    border-bottom: 1px solid #ddd;
    padding: 15px;
    margin: 15px 15%;
    font-weight: 500;
    display: block;
  }

  .button {
    border: 1px solid; border-radius: 4px;
    padding: 5px 15px; margin: 5px;
    text-decoration: none;
    transition: all 0.3;
    &:hover {
      background-color: #42b983; color: #fff;
    }
    &:active {
      background-color: #fff;
    }
  }

  .general-actions {
    .left-action {

    }
    .right-action {
    }
  }
}
</style>
