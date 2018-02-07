<template>
  <div class="dashboard">

    <div class="simple-market-header">
      <h1>{{ title }}</h1>
      <div>Welcome to Simple Market.</div>
    </div>

    <div class="general-info">
       Your address is: {{ coinbaseAddress }} with {{ myBalance }} ETH.
    </div>

    <div class="general-actions action-stack">
      <span class="left-action">
        <a class="action" href="#" @click="getAccountBalance">Refresh Account</a>
      </span>
      <span class="right-action">
        <router-link class="action" to="/sell-item">Sell Secret</router-link>
      </span>
    </div>

    <div class="secret-listing-wrapper">
      <secret-listing></secret-listing>
    </div>

  </div>
</template>

<script>
import SecretListing from '@/components/SecretListing'

export default {
  name: 'dashboard',

  data () {
    return {
      title: 'Simple Market',
      coinbaseAddress: this.$store.getters.getCoinbaseAddress(),
      myBalance: 0
    }
  },

  mounted () {
  },

  watch: {
    '$store.state.coinbaseAddress': function (address) {
      this.coinbaseAddress = address
      this.getAccountBalance()
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
    }

  },

  components: {
    SecretListing
  }
}
</script>

<style lang="scss" scoped>

h1 {
  border-bottom: 1px solid #ddd;
  padding: 15px;
  margin: 15px 50px;
  font-weight: 500;
  display: block;
}

a {
  color: #42b983;
}

.general-info {
  padding: 15px;
}

.general-actions {
  .action {
    border: 1px solid; border-radius: 4px;
    padding: 5px 15px; margin: 5px;
    text-decoration: none;
  }
  .left-action {

  }
  .right-action {
  }
}

.secret-listing-wrapper {
  margin-top: 15px;
}

</style>
