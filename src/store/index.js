import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)
const _ = require('underscore')

const state = {
  contractAddress: '0x8b6302b8505d50ab32a4ecb8c27736b0cca33f35',
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
      ([key, title, price, rank, owner]) => {
        if (!_(state.secrets).has(key)) {
          var oldSecrets = _(state.secrets).clone()
          oldSecrets[key] = {title, price, rank, owner}
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
  }

}

const getters = {

  contractAddress: state => state.contractAddress,

  coinbaseAddress: state => state.coinbaseAddress,

  coinbaseBalance: state => state.coinbaseBalance,

  secrets: state => state.secrets,

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
