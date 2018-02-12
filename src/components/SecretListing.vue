<template>
  <div class="secret-listing">

    <div class="secret-listing-actions">
      <input class="search-field" v-model="searchText" placeholder="Search by secret title">
      <span class="button" @click="toggleShowOwnedFilter">
        <span v-if="showOwnedFilterOn">Show All</span>
        <span v-else>Only Owned</span>
      </span>
    </div>

    <ul id="secret-list">
      <li v-for="(secretData, secretKey) in filteredSecrets">
        <secret-item :data="secretData" :secretKey="secretKey" @reveal="revealSecret(secretKey)"></secret-item>
      </li>
    </ul>

    <div class="load-more">
      <a href="#" @click="loadSecretListing">Load More</a>
    </div>

  </div>
</template>

<script>
import SecretItem from '@/components/SecretItem'
var _ = require('underscore')

export default {
  name: 'secret-listing',

  data () {
    return {
      secrets: this.$store.getters.getSecrets(),
      showOwnedFilterOn: false,
      searchText: ''
    }
  },

  mounted () {
    if (_(this.$store.getters.getSecrets()).isEmpty()) {
      this.loadSecretListing()
    }
  },

  computed: {

    filteredSecrets: function () {
      var regexp = new RegExp(this.searchText, 'g')

      var filteredByOwner = this.showOwnedFilterOn ? _(this.secrets).filter(secret => secret.owned) : this.secrets
      var filteredByRegex = this.searchText === '' ? filteredByOwner : _(filteredByOwner).filter(secret => regexp.test(secret.title))

      return filteredByRegex
    }

  },

  watch: {

    '$store.state.contracts.marketInstance': function () {
      this.$store.dispatch('loadSecrets')
    },

    '$store.state.secrets': function (secrets) {
      this.secrets = secrets
    }

  },

  methods: {

    toggleShowOwnedFilter: function () {
      this.showOwnedFilterOn = !this.showOwnedFilterOn
    },

    loadSecretListing: function (e) {
      this.$store.dispatch('loadSecrets')
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

.search-field {
  width: 40%;
}

input, textarea {
  width: 40%;
}

</style>