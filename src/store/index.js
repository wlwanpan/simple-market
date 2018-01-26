import Vue from 'vue'
import Vuex from 'Vuex'
import TruffleContract from 'truffle-contract'
import SimpleMarketContract from '@contracts/SimpleMarket.json'

Vue.use(Vuex)

const state = {
  coinbaseAddress: null,
  marketContract: null,
  marketInstance: null
}

const mutations = {

  SET_COINBASE_ADDRESS (state, address) {
    state.coinbaseAddress = address
  },
  SET_MARKET_CONTRACT (state, contract) {
    state.marketContract = contract
  },
  SET_MARKET_INSTANCE (state, instance) {
    state.marketInstance = instance
  }

}

const actions = {

  initCoinbaseAddress (context) {
    window.web3.eth.getCoinbase(function (err, address) {
      if (err) window.alert(err)
      context.commit('SET_COINBASE_ADDRESS', address)
    })
  },

  initMarketContract (context) {
    var marketContract = TruffleContract(SimpleMarketContract)

    marketContract.setProvider(window.web3.currentProvider)
    debugger
    marketContract.deployed()
    .then((marketInstance) => {
      context.commit('SET_MARKET_CONTRACT', marketContract)
      context.commit('SET_MARKET_INSTANCE', marketInstance)
    })
    .catch((err) => {
      window.alert(err)
    })
  }

}

const getters = {
  getCoinbaseBalance: (state) => () => state.coinbaseAddress,
  getMarketContract: (state) => () => state.marketContract,
  getMarketInstance: (state) => () => state.marketInstance
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
