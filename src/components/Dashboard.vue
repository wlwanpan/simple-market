<template>
  <div class="dashboard">

    <div class="general-actions action-stack">
      <span class="left-action">
        <a class="button" href="#" @click="getAccountBalance">Refresh Account</a>
      </span>
      <span class="right-action">
        <router-link class="button" to="/sell-secret">Sell Secret</router-link>
      </span>
    </div>

    <div class="general-info">
       <strong>Wallet Address:</strong> {{ coinbaseAddress }}
      <div class="details">
        <strong>Available Balance:</strong> {{ myBalance }} ETH.
      </div>
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
      coinbaseAddress: this.$store.getters.getCoinbaseAddress(),
      myBalance: this.$store.getters.getCoinbaseBalance()
    }
  },

  watch: {
    '$store.state.coinbaseAddress': function (address) {
      this.coinbaseAddress = address
      this.getAccountBalance()
    },
    '$store.state.coinbaseBalance': function (balance) {
      this.myBalance = balance
    }
  },

  methods: {

    getAccountBalance: function (e) {
      window.web3.eth.getBalance(this.coinbaseAddress, (err, balance) => {
        if (err) return (console.alert(err))

        this.$store.dispatch({
          type: 'setCoinbaseBalance',
          balance: window.web3.fromWei(balance.toString(), 'ether')
        })
      })
    }

  },

  components: {
    SecretListing
  }
}
</script>

<style lang="scss" scoped>

.general-info {
  padding: 15px;

  .details {

  }
}

.general-actions {
  margin: 15px;
}

.secret-listing-wrapper {
}

</style>
