<template>
  <div class="dashboard">

    <div class="dashboard-header">
      Each secret auctioned can be traded indefinetely at selling price.
      The latest buyer is able to reveal the secret and requires only the network gas price
      to perform. The color indicates the number of times the secret has been traded.
    </div>

    <div class="general-actions action-stack">
      <span class="left-action">
        <a class="button right" @click.prevent="refreshCoinbaseAddress">Refresh</a>
      </span>
      <span class="right-action">
        <router-link class="button left" to="/sell-secret">Sell Secret</router-link>
      </span>
    </div>

    <div class="general-info">
       <strong>Wallet Address:</strong> {{ coinbaseAddress }}
      <div class="details">
        <strong>Available Balance:</strong> {{ coinbaseBalance }} ETH.
      </div>
    </div>

    <div class="secret-listing-wrapper">
      <secret-listing></secret-listing>
    </div>

  </div>
</template>

<script>
import SecretListing from '@/components/SecretListing'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',

  computed: {
    ...mapGetters([
      'coinbaseAddress',
      'coinbaseBalance'
    ])
  },

  watch: {

    'coinbaseAddress': function (address) {
      this.$store.dispatch('refreshCoinbaseBalance')
      this.$store.dispatch('refreshSecrets')
    }

  },

  methods: {

    refreshCoinbaseAddress: function (e) {
      this.$store.dispatch('refreshCoinbaseAddress')
      this.$store.dispatch('refreshSecrets')
    }

  },

  components: {
    SecretListing
  }
}
</script>

<style lang="scss" scoped>

.dashboard-header {
  max-width: 600px;
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

</style>
