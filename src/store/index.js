import Vue from 'vue'
import Vuex from 'Vuex'
import TruffleContract from 'truffle-contract'
import SimpleMarketContract from '@contracts/SimpleMarket.json'

Vue.use(Vuex)

const state = {
  coinbaseAddress: '0x0',
  contracts: {
    marketInstance: null
  },
  availableSecrets: {},
  transactionHistory: {}
}

const mutations = {

  SET_COINBASE_ADDRESS (state, address) {
    state.coinbaseAddress = address
  },

  SET_MARKET_CONTRACT_INSTANCE (state, instance) {
    state.contracts.marketInstance = instance
  }

}

const actions = {

  saveTransactionData ({ state, commit }, { transaction }) {
    commit('SAVE_TRANSACTION', transaction)
    return state.transactionHistory
  },

  refreshAvailableSecrets ({ state, commit }) {
    var instance = state.contracts.marketInstance

    instance.getNumberOfSecrets.call()
    .then((secretCount) => {
      // var count = secretCount.toNumber()
      instance.getSecretByIndex.call(new window.web3.BigNumber(0))
      .then((result) => {
        // continue here
        debugger
      })
    })
  },

  initCoinbaseAddress ({ commit }) {
    window.web3.eth.getCoinbase(function (err, address) {
      if (err) window.alert(err)
      commit('SET_COINBASE_ADDRESS', address)
    })
  },

  initContractInstance ({ commit }, { address }) {
    var marketContract = TruffleContract(SimpleMarketContract)
    marketContract.setProvider(window.web3.currentProvider)

    commit('SET_MARKET_CONTRACT_INSTANCE', marketContract.at(address))
  }

}

const getters = {
  getCoinbaseAddress: (state) => () => state.coinbaseAddress,
  getMarketContractInstance: (state) => () => state.contracts.marketInstance,
  getAvailableSecrets: (state) => () => state.availableSecrets
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
