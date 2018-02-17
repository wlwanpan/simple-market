<template>
  <div class="dashboard">

    <div class="dashboard-header">
      It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
      and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </div>

    <div class="general-actions action-stack">
      <span class="left-action">
        <a class="button right" @click.prevent="changeCoinbaseAddress">Change Account</a>
      </span>
      <span class="right-action">
        <router-link class="button left" to="/sell-secret">Sell Secret</router-link>
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
const _ = require('underscore')

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

    // implement change account for
    changeCoinbaseAddress: function (e) {
      window.web3.eth.getAccounts((err, result) => {
        if (err) console.alert(err)

        this.$store.dispatch(
          'refreshModal',
          {
            options: {
              title: 'Select Account',
              show: true,
              selectable: true,
              callback: this.changeAddress
            },
            data: _(result).object(result)
          }
        )
      })
    },

    changeAddress: function (address) {
      this.$store.dispatch('initCoinbaseAddress', { address })
      this.$store.dispatch('loadSecrets')
    },

    getAccountBalance: function (e) {
      window.web3.eth.getBalance(this.coinbaseAddress, (err, balance) => {
        if (err) return console.alert(err)

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

.dashboard-header {
  width: 67%; max-width: 600px;
  margin: 0 auto; padding: 15px;
  margin-bottom: 15px;
  background-color: rgba(15, 15, 15, 0.015);
  border-radius: 5px;
}

.general-info {
  padding: 15px;

  .details {

  }
}

.general-actions {
  margin-bottom: 15px;
  margin-top: 25px;
}

.secret-listing-wrapper {
}

</style>
