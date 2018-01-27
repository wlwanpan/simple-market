<template>
  <div class="dashboard">

    <h1>{{ title }}</h1>
    <div>Welcome to simple market.</div>
    <div>Your address is: {{ coinbaseAddress }} with {{ myBalance }} ETH.</div><br>
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
      coinbaseAddress: this.$store.state.coinbaseAddress,
      availableArticles: this.$store.state.availableArticles,
      myBalance: 0
    }
  },

  mounted () {
    _(this.$store.state.availableArticles).each((article) => {
      console.log(article)
    })
  },

  watch: {
    '$store.state.coinbaseBalance': {
      handler: function (address) {
        this.coinbaseAddress = address
      }
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
      return this.$store.dispatch('refreshAvailableArticles')
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
