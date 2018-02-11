<template>
  <div id="app">

    <info-modal @close="closeModal" :popup="modal.show" :properties="modal.data" :title="modal.title">
    </info-modal>

    <h1 class="app-header"> Simple Market </h1>
    <router-view></router-view>

  </div>
</template>

<script>
import InfoModal from '@/components/InfoModal'

export default {
  name: 'app',

  data () {
    return {
      modal: this.$store.state.modal
    }
  },

  mounted: function () {
    // Store Contract Instance Address in config file
    this.$store.dispatch('initContractInstance', {address: '0x2a76f74534790dd75e83d55a89b6f7d2e2df1989'})
    this.$store.dispatch('initCoinbaseAddress')
  },

  methods: {
    closeModal: function () {
      this.$store.dispatch(
        'refreshModal',
        {
          title: '',
          show: false,
          data: {}
        }
      )
    }
  },

  watch: {
    '$store.state.modal': function (modalData) {
      this.modal = modalData
    }
  },

  components: {
    InfoModal
  }

}
</script>

<style lang="scss">
#app {
  // Global  Styles
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .app-header {
    border-bottom: 1px solid #ddd;
    padding: 15px;
    margin: 15px 15%;
    font-weight: 500;
    display: block;
  }

  li {
    list-style: none;
  }

  .button {
    border: 1px solid #42b983; border-radius: 4px;
    padding: 5px 15px; margin: 5px; color: #42b983;
    text-decoration: none;
    transition: all 0.3;
    &:focus {
      outline: none;
    }
    &:hover {
      background-color: #42b983; color: #fff;
    }
    &:active {
      background-color: #fff; color: #42b983;
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
