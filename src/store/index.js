import Vue from 'vue'
import Vuex from 'Vuex'
import TruffleContract from 'truffle-contract'
import SimpleMarketContract from '@contracts/SimpleMarket.json'

Vue.use(Vuex)
var _ = require('underscore')

const state = {
  coinbaseAddress: '0x0',
  contracts: {
    marketInstance: null
  },
  secrets: {},
  transactionHistory: {}
}

const mutations = {

  SET_COINBASE_ADDRESS (state, address) {
    state.coinbaseAddress = address
  },

  SET_MARKET_CONTRACT_INSTANCE (state, instance) {
    state.contracts.marketInstance = instance
  },

  UPDATE_SECRET_STORE (state, data) {
    if (data.length === 0) return

    _(data).each(
      ([key, title, price]) => {
        if (!_(state.secrets).has(key)) {
          var oldSecrets = _(state.secrets).clone()
          oldSecrets[key] = {title, price}
          state.secrets = oldSecrets
        }
      }
    )
  }

}

const actions = {

  saveTransactionData ({ state, commit }, { transaction }) {
    commit('SAVE_TRANSACTION', transaction)
    return state.transactionHistory
  },

  refreshSecrets ({ state, commit }) {
    var instance = state.contracts.marketInstance

    instance.getNumberOfSecrets.call()
    .then((count) => {
      var promiseArr = []
      _(_.range(count.toNumber())).each((index) => {
        promiseArr.push(
          new Promise(function (resolve, reject) {
            instance.getSecretByIndex.call(window.web3.toBigNumber(index))
            .then(data => {
              resolve(data)
            })
          })
        )
      })

      Promise.all(promiseArr).then(function (secrets) {
        commit('UPDATE_SECRET_STORE', secrets)
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
  getSecrets: (state) => () => state.secrets
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
