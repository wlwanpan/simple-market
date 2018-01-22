import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import Web3 from 'web3'

Vue.config.productionTip = false

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    console.log('Web3 injected browser: OK.')
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    console.log('Web3 injected browser: Fail. You should consider trying MetaMask.')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  new Vue({ // eslint-disable-line no-new
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
})
