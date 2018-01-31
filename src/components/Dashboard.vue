<template>
  <div class="dashboard">

    <div class="simple-market-header">
      <h1>{{ title }}</h1>
      <div>Welcome to simple market.</div>
    </div>

    <div>Your address is: {{ shortCoinbaseAddress }} with {{ myBalance }} ETH.</div><br>
    <a href="#" @click="getAccountBalance">Update Balance.</a><br>
    <div>Click <router-link to="/sell-item">sell an item</router-link> to place a sell order.</div>

    <a href="#" @click="loadAvailableArticles">Load Articles</a>

    <ul id="article-list">
      <li v-for="article in availableArticles">
        {{ article.seller }} - {{ article.name }} - {{ article.price.toString() }}
      </li>
    </ul>

  </div>
</template>

<script>
var _ = require('underscore')

export default {
  name: 'dashboard',

  data () {
    return {
      title: 'Simple Market',
      coinbaseAddress: this.$store.getters.getCoinbaseAddress(),
      availableArticles: this.$store.getters.getAvailableArticles(),
      myBalance: 0
    }
  },

  computed: {
    shortCoinbaseAddress: function () {
      return this.coinbaseAddress
    }
  },

  mounted () {
    if (this.coinbaseAddress !== '0x0') {
      this.getAccountBalance()
    }

    _(this.$store.state.availableArticles).each((article) => {
      console.log(article)
    })
  },

  watch: {
    '$store.state.coinbaseAddress': (address) => {
      this.coinbaseAddress = address
      console.log(this.coinbaseAddress)
    },
    '$store.state.availableArticles': {
      deep: true,
      handler: function (articles) {
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

    loadAvailableArticles: function (e) {
      this.$store.dispatch('refreshAvailableArticles')
      .then((results) => {
        var test = this.$store.getters.getAvailableArticles()
        console.log(test)
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
