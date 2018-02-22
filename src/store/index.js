import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)
const _ = require('underscore')

const state = {
  contractAddress: '0xff34e514e58e6683d83892ecdfda52fd48321748',
  processing: false,
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
    var updatedSecrets = _(state.secrets).clone()

    _(data).each(
      ([key, title, price, rank, owner]) => {
        if (!_(state.secrets).has(key)) {
          updatedSecrets[key] = {title, price, rank, owner}
        } else {
          if (owner) { updatedSecrets[key].owner = owner }
          if (rank) { updatedSecrets[key].rank = rank }
        }
      }
    )

    state.secrets = updatedSecrets
  },

  EMPTY_SECRET_STORE (state) {
    state.secrets = {}
  },

  UPDATE_PROCESSING_STATE (state, processingState) {
    state.processing = processingState
  }

}

const actions = {

  loadSecrets ({ getters, state, commit }) {
    const PAGINATION_LIMIT = 10
    if (!getters.marketContract) return

    getters.marketContract.getNumberOfSecrets.call()
    .then((count) => {
      var promiseArr = []
      var totalSecretCount = count.toNumber()
      var paginationFrom = _(state.secrets).keys().length
      var paginationTo = (totalSecretCount - paginationFrom) > PAGINATION_LIMIT ? (paginationFrom + PAGINATION_LIMIT) : totalSecretCount

      _(_.range(paginationFrom, paginationTo)).each((index) => {
        promiseArr.push(
          new Promise(function (resolve, reject) {
            getters.marketContract.getSecretByIndex.call(window.web3.toBigNumber(index))
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

  updateSingleSecret ({ commit }, { key, owner, rank }) {
    commit('UPDATE_SECRET_STORE', [[key, undefined, undefined, rank, owner]])
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

  refreshCoinbaseAddress ({ commit, dispatch }) {
    window.web3.eth.getAccounts((err, result) => {
      if (err) window.alert(err)

      if (result.length) {
        console.log('Logged in as:' + result)
        commit('SET_COINBASE_ADDRESS', result[0])
      } else {
        dispatch(
          'refreshModal',
          {
            options: {
              title: 'No Account detected',
              show: true,
              selectable: false
            },
            data: {
              MetamaskError: 'Your account might be locked. Unlock it to proceed',
              LocalNodeError: 'No local geth testrpc running on port: 8545'
            }
          }
        )
      }
    })
  },

  setLoading ({ commit }) {
    commit('UPDATE_PROCESSING_STATE', true)
  },

  stopLoading ({ commit }) {
    commit('UPDATE_PROCESSING_STATE', false)
  }

}

const getters = {

  contractAddress: state => state.contractAddress,

  coinbaseAddress: state => state.coinbaseAddress,

  coinbaseBalance: state => state.coinbaseBalance,

  processing: state => state.processing,

  secrets: state => state.secrets,

  modal: state => state.modal,

  marketContract: state => window.marketContract.at(state.contractAddress),

  computedGasLimit: (state) => amountInWei => {
    const defaultGasLimit = 500000

    return new Promise((resolve, reject) => {
      if (amountInWei === 'default') resolve(defaultGasLimit)

      window.web3.eth.estimateGas(
        {
          from: state.coinbaseAddress,
          to: state.contractAddress,
          amount: amountInWei
        },
        (err, result) => {
          if (err || !result) resolve(defaultGasLimit)
          else resolve(result)
        }
      )
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
