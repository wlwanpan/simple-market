<template>
  <div class="dashboard">

    <div class="simple-market-header">
      <h1>{{ title }}</h1>
      <div>Welcome to Simple Market.</div>
    </div>

    <div>
       Your address is: {{ coinbaseAddress }} with {{ myBalance }} ETH.
   </div>

    <a href="#" @click="getAccountBalance">Update Balance.</a><br>

    <div>Click <router-link to="/sell-item">sell an item</router-link> to place a sell order.</div>

    <a href="#" @click="loadAvailableSecrets">Load Secrets</a>

    <ul id="secret-list">
      <li v-for="secret in availableSecrets">
        {{ secret.title }} - {{ secret.price.toString() }}
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'dashboard',

  data () {
    return {
      title: 'Simple Market',
      coinbaseAddress: this.$store.getters.getCoinbaseAddress(),
      availableSecrets: this.$store.getters.getAvailableSecrets(),
      myBalance: 0
    }
  },

  mounted () {
    if (this.coinbaseAddress !== '0x0') {
      this.getAccountBalance()
    }
  },

  watch: {
    '$store.state.coinbaseAddress': (address) => {
      this.coinbaseAddress = address
    },
    '$store.state.availableSecrets': {
      deep: true,
      handler: function (secrets) {
        debugger
      }
    }
  },

  methods: {

    getAccountBalance: function (e) {
      window.web3.eth.getBalance(this.coinbaseAddress, (err, balance) => {
        if (err) console.alert(err)

        var balanceInEther = window.web3.fromWei(balance.toString(), 'ether')
        this.myBalance = balanceInEther
        return balanceInEther
      })
    },

    loadAvailableSecrets: function (e) {
      console.log('load available secrets')
      this.$store.dispatch('refreshAvailableSecrets')
    }

  }
}
</script>

<style lang="scss" scoped>

h1 {
  padding: 10px;
  font-weight: normal;
  display: block;
}

a { color: #42b983; }

</style>
