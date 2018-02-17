import Vue from 'vue'
import Vuex from 'Vuex'
import TruffleContract from 'truffle-contract'
import SimpleMarketContract from '@contracts/SimpleMarket.json'

Vue.use(Vuex)
const _ = require('underscore')

const state = {
  modal: {
    options: {
      show: false,
      title: ''
    },
    data: {}
  },
  coinbaseAddress: '0x0',
  coinbaseBalance: 0,
  secrets: {}
}

const mutations = {

  REFERSH_MODAL_DATA (state, modalData) {
    state.modal = modalData
  },

  SET_COINBASE_ADDRESS (state, address) {
    state.coinbaseAddress = address
  },

  SET_COINBASE_BALANCE (state, balance) {
    state.coinbaseBalance = balance
  },

  UPDATE_SECRET_STORE (state, data) {
    if (data.length === 0) return

    _(data).each(
      ([key, title, price, rank, owned]) => {
        if (!_(state.secrets).has(key)) {
          var oldSecrets = _(state.secrets).clone()
          oldSecrets[key] = {title, price, rank, owned}
          state.secrets = oldSecrets
        }
      }
    )
  },

  EMPTY_SECRET_STORE (state) {
    state.secrets = {}
  }

}

const actions = {

  loadSecrets ({ state, commit }) {
    const PAGINATION_LIMIT = 10
    if (!window.instance) return

    window.instance.getNumberOfSecrets.call()
    .then((count) => {
      var promiseArr = []
      var totalSecretCount = count.toNumber()
      var paginationFrom = _(state.secrets).keys().length
      var paginationTo = (totalSecretCount - paginationFrom) > PAGINATION_LIMIT ? (paginationFrom + PAGINATION_LIMIT) : totalSecretCount

      _(_.range(paginationFrom, paginationTo)).each((index) => {
        promiseArr.push(
          new Promise(function (resolve, reject) {
            window.instance.getSecretByIndex.call(window.web3.toBigNumber(index))
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

  refreshSecrets ({ dispatch, commit }) {
    commit('EMPTY_SECRET_STORE')
    dispatch('loadSecrets')
  },

  refreshModal ({ commit }, modalData) {
    commit('REFERSH_MODAL_DATA', modalData)
  },

  // Initialization Actions
  setCoinbaseBalance ({ commit }, { balance }) {
    commit('SET_COINBASE_BALANCE', balance)
  },

  refreshCoinbaseBalance ({ state, commit }) {
    window.web3.eth.getBalance(state.coinbaseAddress, (err, balance) => {
      if (err) return window.alert(err)
      commit('SET_COINBASE_BALANCE', window.web3.fromWei(balance.toString(), 'ether'))
    })
  },

  refreshCoinbaseAddress ({ commit }) {
    window.web3.eth.getAccounts((err, result) => {
      if (err) window.alert(err)

      console.log('Logged in as:' + result)
      commit('SET_COINBASE_ADDRESS', result[0])
    })
  },

  initContractInstance ({ commit }, { address }) {
    var marketContract = TruffleContract(SimpleMarketContract)
    marketContract.setProvider(window.web3.currentProvider)

    // OMG This is so dump =>  cannot store truffle contract instances to vuex store
    window.instance = marketContract.at(address)
  }

}

const getters = {
  getCoinbaseAddress: (state) => () => state.coinbaseAddress,
  getCoinbaseBalance: (state) => () => state.coinbaseBalance,
  getSecrets: (state) => () => state.secrets
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
