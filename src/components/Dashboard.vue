<template>
  <div class="dashboard">

    <h1>{{ title }}</h1>
    <div>Welcome to simple market.</div>
    <div>Your address is: {{ coinbaseAddress }} with {{ myBalance }} ETH.</div><br>
    <a href="#" @click="getAccountBalance">Update Balance.</a><br>
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
      coinbaseAddress: this.$store.state.coinbaseAddress,
      myBalance: 0
    }
  },

  computed: {
    coinbaseAddressExist: function () {
      return _(this.coinbaseAddress).isUndefined()
    }
  },

  beforeCreate: function () {
    this.$store.dispatch('initCoinbaseAddress')
    this.$store.dispatch('initMarketContract')
  },

  mounted: function () {
    this.$store.watch(this.$store.getters.getCoinbaseBalance, (address) => {
      this.coinbaseAddress = address
    })
  },

  methods: {
    getAccountBalance: function (e) {
      window.web3.eth.getBalance(this.coinbaseAddress, (err, balance) => {
        if (err) console.alert(err)

        var balanceInEther = window.web3.fromWei(balance.toString(), 'ether')
        this.myBalance = balanceInEther
        console.log(balanceInEther)
        return balanceInEther
      })
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
