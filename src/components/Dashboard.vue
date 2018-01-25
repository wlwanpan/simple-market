<template>
  <div class="dashboard">
    <h1>{{ title }}</h1>
    Welcome to simple market.
    <div>Your address is: {{ coinbaseAddress }}</div>
    <a href="#" @click="getAccountBalance">Check Balance.</a>
    <div>Click <router-link to="/sell-item">sell an item</router-link> to place a sell order.</div>
  </div>
</template>

<script>
var _ = require('underscore')

export default {
  name: 'dashboard',
  data () {
    return {
      title: 'Simple Market',
      coinbaseAddress: this.$store.state.coinbaseAddress
    }
  },
  computed: {
    coinbaseAddressExist: function () {
      return _(this.coinbaseAddress).isUndefined()
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('initCoinbaseAddress')
  },
  mounted: function () {
    this.$store.watch(this.$store.getters.getCoinbaseBalance, (address) => {
      this.coinbaseAddress = address
    })
  },
  methods: {
    getAccountBalance: function (e) {
      window.web3.eth.getBalance(this.coinbaseAddress, (err, balance) => {
        if (err) console.log(err)

        var balanceInEther = window.web3.fromWei(balance.toString(), 'ether')
        console.log(balanceInEther)
        return balanceInEther
      })
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
  display: block;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
