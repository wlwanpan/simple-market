import Vue from 'Vue'
import Vuex from 'Vuex'
import {_} from 'underscore'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    coinbaseAddress: ''
  },
  mutations: {
    setCoinbaseAddress (state, address) {
      state.coinbaseAddress = address
    }
  },
  actions: {
    initCoinbaseAddress (context) {
      window.web3.eth.getCoinbase(function (err, address) {
        if (_(err).isNull()) return
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
    getCoinbaseBalance: (state, getters) => {
      window.web3.eth.getBalance(state.coinbaseAddress, (err, balance) => {
        if (_(err).isNull()) return
        return window.web3.fromWei(balance, 'ether')
      })
    }
  }

})
