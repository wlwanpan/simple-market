import Vue from 'vue'
import Vuex from 'Vuex'
import TruffleContract from 'truffle-contract'
import SimpleMarketContract from '@contracts/SimpleMarket.json'

Vue.use(Vuex)
var _ = require('underscore')

const state = {
  coinbaseAddress: '0x0',
  contracts: {
    marketContract: null
  },
  availableArticles: {},
  transactionHistory: {}
}

const mutations = {

  SET_COINBASE_ADDRESS (state, address) {
    state.coinbaseAddress = address
  },
  SET_MARKET_CONTRACT (state, contract) {
    state.contracts.marketContract = contract
  },
  SET_AVAILABLE_ARTICLES (state, article) {
    var hashKey = window.web3.sha3(JSON.stringify(article))
    if (_(state.availableArticles).has(hashKey)) return
    state.availableArticles[hashKey] = article
  },
  SAVE_TRANSACTION (state, { tx, receipt }) {
    state.transactionHistory[tx] = receipt
  }

}

const actions = {

  saveTransactionData ({ state, commit }, { transaction }) {
    commit('SAVE_TRANSACTION', transaction)
    return state.transactionHistory
  },

  refreshAvailableArticles ({ dispatch, commit }) {
    dispatch('deployMarketContract')
    .then((instance) => {
      return instance.getArticle.call()
    })
    .then((article) => {
      var [seller, name, description, price] = article
      if (seller === 0x0) return
      commit('SET_AVAILABLE_ARTICLES', {seller, name, description, price})
    })
    .catch((err) => {
      window.alert(err)
    })
  },

  deployMarketContract ({ state }) {
    return state.contracts.marketContract.deployed()
  },

  initCoinbaseAddress ({ commit }) {
    window.web3.eth.getCoinbase(function (err, address) {
      if (err) window.alert(err)
      commit('SET_COINBASE_ADDRESS', address)
    })
  },

  initMarketContract ({ commit }) {
    var marketContract = TruffleContract(SimpleMarketContract)

    marketContract.setProvider(window.web3.currentProvider)
    commit('SET_MARKET_CONTRACT', marketContract)
  }

}

const getters = {
  getCoinbaseAddress: (state) => () => state.coinbaseAddress,
  getMarketContract: (state) => () => state.contracts.marketContract,
  getAvailableArticles: (state) => () => state.availableArticles
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
