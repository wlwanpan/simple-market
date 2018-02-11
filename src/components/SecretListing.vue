<template>
  <div class="secret-listing">

    <div class="secret-listing-actions">
      <a href="#" @click="refreshSecretListing">Refresh Listings</a>
    </div>

    <ul id="secret-list">
      <li v-for="(secretData, secretKey) in secrets">
        <secret-item :data="secretData" :secretKey="secretKey" @reveal="revealSecret(secretKey)"></secret-item>
      </li>
    </ul>

  </div>
</template>

<script>
import SecretItem from '@/components/SecretItem'

export default {
  name: 'secret-listing',

  data () {
    return {
      secrets: this.$store.getters.getSecrets()
    }
  },

  watch: {

    '$store.state.contracts.marketInstance': function () {
      this.$store.dispatch('refreshSecrets')
    },

    '$store.state.secrets': function (secrets) {
      this.secrets = secrets
    }

  },

  methods: {

    refreshSecretListing: function (e) {
      this.$store.dispatch('refreshSecrets')
    },

    revealSecret: function (key) {
      this.$store.getters.getMarketContractInstance().revealSecret.call(key)
      .then((message) => {
        this.$store.dispatch(
          'refreshModal',
          {
            title: 'Secret Reveal',
            show: true,
            data: {
              secretMessage: message
            }
          }
        )
      })
    }
  },

  components: {
    SecretItem
  }
}

</script>

<style lang="scss" scoped>

</style>