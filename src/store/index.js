import Vue from 'vue'
import Vuex from 'Vuex'
var _ = require('underscore')

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    coinbaseAddress: undefined
  },

  mutations: {
    setCoinbaseAddress (state, address) {
      state.coinbaseAddress = address
    }
  },

  actions: {
    initCoinbaseAddress (context) {
      window.web3.eth.getCoinbase(function (err, address) {
        if (!_(err).isNull()) return window.alert(err)
        context.commit('setCoinbaseAddress', address)
      })
    },

    initContracts (context) {
      //   $.getJSON('ChainList.json', function(chainListArtifact) {
      //     App.contracts.ChainList = TruffleContract(chainListArtifact)
      //     App.contracts.ChainList.setProvider(App.web3Provider)
      //   })
    }

  },

  getters: {
    getCoinbaseBalance: (state) => () => state.coinbaseAddress
  }
})
