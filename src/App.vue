<template>
  <div id="app">

    <info-modal @close="closeModal" :options="modal.options" :data="modal.data">
    </info-modal>

    <div class="app-wrapper">
      <h1 class="app-header"> Simple Market </h1>
      <router-view></router-view>
    </div>

    <div class="app-footer">
      <strong>Contract Address:</strong> {{ contractAddress }}
    </div>

  </div>
</template>

<script>
import InfoModal from '@/components/InfoModal'
import { mapGetters } from 'vuex'

export default {
  name: 'app',

  data () {
    return {
      modal: this.$store.state.modal
    }
  },

  computed: {
    ...mapGetters([
      'coinbaseAddress',
      'coinbaseBalance',
      'contractAddress',
      'marketContract'
    ])
  },

  mounted: function () {
    this.initContactEventWatcher()
    this.$store.dispatch('refreshCoinbaseAddress')
  },

  methods: {

    initContactEventWatcher: function () {
      this.getBlockNumber((err, blockHeight) => {
        console.log(blockHeight)
        if (err) window.alert(err)

        this.marketContract.SecretBoughtEvent({}, { fromBlock: blockHeight, toBlock: 'latest' })
        .watch((err, result) => {
          if (err) window.alert(err)

          console.log('from bought event')
          console.log(result.args)
        })

        this.marketContract.SecretAddedEvent({}, { fromBlock: blockHeight, toBlock: 'latest' })
        .watch((err, result) => {
          if (err) window.alert(err)
          // var { key, title, price, rank, owned } = result.args
          // [[key, title, price, rank, owned]]
          console.log('from added event')
          console.log(result.args)
        })
      })
    },

    closeModal: function () {
      this.$store.dispatch(
        'refreshModal',
        {
          options: {
            title: '',
            show: false,
            selectable: false
          },
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
  text-align: center; height: 100%;
  color: #2c3e50;

  display: flex; flex-direction: column;
  justify-content: space-between;

  .app-header {
    border-bottom: 1px solid #ddd;
    padding: 15px;
    margin: 15px 15%;
    font-weight: bold;
    display: block;
    opacity: 0.8;
    font-size: 40px;
  }

  .app-wrapper {
    width: 70%; margin: 0 auto;
  }

  .app-footer {
    padding: 15px;
  }

  ul {
    padding: 0;
    list-style-type: none;
  }

  li {
    list-style: none;
  }

  .button {
    border: 1px solid #494e75; border-radius: 4px;
    padding: 5px 15px; color: #494e75;
    text-decoration: none;
    transition: all 0.3;

    &.left { border-radius: 0 5px 5px 0; }
    &.right { border-radius: 5px 0 0 5px; }
    &:focus { outline: none; }
    &:hover { background-color: #494e75; color: #fff; }
    &:active { background-color: #fff; color: #494e75; }
  }

  input, textarea {
    padding: 8px;
    font-size: 15px;
    resize: none; border: none;
    border-bottom: 1px solid #ddd;
    &:focus {
      outline: none;
      border-bottom: 1px solid #494e75;
    }

    &::-webkit-input-placeholder {
      transition: opacity 0.4s;
      opacity: 0.8;
    }
    &:focus::-webkit-input-placeholder {
      opacity: 0.2;
    }
  }
}

html, body { height: 100%; margin: 0px; }
</style>
