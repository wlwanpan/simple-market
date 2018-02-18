<template>
  <div class="secret-listing">

    <div class="secret-listing-actions">
      <input class="search-field" v-model="searchText" placeholder="Search by secret title">
      <div class="button left" @click.prevent="toggleShowOwnedFilter">
        <span v-if="showOwnedFilterOn">Show All</span>
        <span v-else>Show Owned</span>
      </div>
    </div>

    <ul id="secret-list">
      <li v-for="(secretData, secretKey) in filteredSecrets">
        <secret-item :data="secretData" :secretKey="secretKey" @reveal="revealSecret(secretKey)"></secret-item>
      </li>
    </ul>

    <div class="load-more">
      <a href="#" @click.prevent="loadSecretListing">Load More</a>
    </div>

  </div>
</template>

<script>
import SecretItem from '@/components/SecretItem'
const _ = require('underscore')

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

    '$store.state.coinbaseAddress': function () {
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
      window.instance.revealSecret.call(
        key,
        {
          from: this.$store.getters.getCoinbaseAddress(),
          gas: 500000
        }
      )
      .then(([message, rank]) => {
        this.$store.dispatch(
          'refreshModal',
          {
            options: {
              title: 'Secret Reveal',
              show: true,
              selectable: false
            },
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

<style lang="scss">

.search-field {
  width: 40%;
}

.button {
  display: inline-block; width: 130px;
}

#secret-list > li {
  width: 70%; max-width: 600px;
  margin: 0 auto; margin-bottom: 10px;
  background-color: rgba(15, 15, 15, 0.015);
  border-radius: 5px; border: 1px solid transparent;

  .secret-title, .secret-price {
    opacity: 0.6;
  }

  &:hover {
    background-color: white;
    border-left: 1px solid #494e75; opacity: 1;
    .secret-title, .secret-price {
      opacity: 1;
    }
  }
}

.secret-listing-actions {
  margin-bottom: 20px;
}

input, textarea {
  width: 40%; max-width: 400px;
}

</style>