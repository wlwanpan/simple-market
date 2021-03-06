<template>
  <div id="app">

    <info-modal @close="closeModal" :options="modal.options" :data="modal.data">
    </info-modal>

    <div class="app-wrapper">
      <h1 class="app-header">
        <div v-if="processing" class="process-loader">
          Processing <span>.</span><span>.</span><span>.</span>
        </div>
        <div v-else>
          Simple Market
        </div>
      </h1>
      <router-view></router-view>
    </div>

    <div class="app-footer">
      <div class="contract-address-footer">
        <strong>Contract Address:</strong>
        {{ contractAddress }}
      </div>
    </div>

  </div>
</template>

<script>
import InfoModal from '@/components/InfoModal'
import { mapGetters } from 'vuex'

export default {
  name: 'app',

  computed: {
    ...mapGetters([
      'coinbaseAddress',
      'coinbaseBalance',
      'contractAddress',
      'marketContract',
      'processing',
      'modal'
    ])
  },

  mounted: function () {
    this.$store.dispatch('refreshCoinbaseAddress')
    this.initContactEventWatcher()
  },

  methods: {

    initContactEventWatcher: function () {
      this.getBlockNumber((err, blockHeight) => {
        console.log('Chain currently at: ' + blockHeight)
        if (err) window.alert(err)

        this.marketContract.SecretBoughtEvent({}, { fromBlock: blockHeight, toBlock: 'latest' })
        .watch((err, result) => {
          if (err) window.alert(err)

          console.log('from bought event')
          console.log(result.args)
        })

        this.marketContract.SecretAddedEvent({}, { fromBlock: blockHeight, toBlock: 'latest' })
        .watch((err, result) => {
          if (err) console.log(err)
          if (result.event === 'SecretAddedEvent' && result.type === 'mined') {
            this.$store.dispatch('addSingleSecret', result.args)
          }
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

  components: {
    InfoModal
  }

}
</script>

<style lang="scss">

@keyframes blink {
  50% { color: transparent }
}

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
    margin-bottom: 25px; margin-top: 0;
    padding: 15px;
    font-weight: bold;
    display: block;
    opacity: 0.8;
    font-size: 40px;

    .process-loader {
      span { animation: 1.5s blink infinite; }
      span:nth-child(2) { animation-delay: 0.5s; }
      span:nth-child(3) { animation-delay: 1s; }
    }
  }

  .app-wrapper {
    margin: 0 auto; max-width: 620px;
  }

  .app-footer {
    margin: 0 auto; width: 620px;
    .contract-address-footer {
      padding-top: 15px; padding-bottom: 15px;
      border-top: 1px solid #ddd;
    }
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
    &.bottom { border-radius: 5px 5px 0 0; }
    &.top { border-radius: 0 0 5px 5px; }
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
