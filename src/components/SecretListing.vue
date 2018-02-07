<template>
  <div class="secret-listing">

    <div class="secret-listing-actions">
      <a href="#" @click="refreshSecretListing">Refresh Listings</a>
    </div>

    <ul id="secret-list">
      <li v-for="secret in secrets">
        <secret-item :title="secret.title" :price="secret.price" :keyHash="secret.key">
        </secret-item>
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
    }
  },

  components: {
    SecretItem
  }
}

</script>

<style lang="scss" scoped>

li {
  list-style: none;
}

</style>