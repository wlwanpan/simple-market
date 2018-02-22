<template>
  <div class="secret-listing">

    <div class="secret-listing-actions">
      <input class="search-field" v-model="searchText" placeholder="Search by secret title">
      <div class="button left" @click.prevent="toggleShowOwnedFilter">
        <span v-if="showOwnedFilterOn">Show All</span>
        <span v-else>Show Owned</span>
      </div>
    </div>

    <div v-if="isFilteredSecretsEmpty">
      <div class="placeholder">
        No Secrets Available.
      </div>
    </div>
    <ul v-else id="secret-list">
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
import { mapGetters } from 'vuex'
const _ = require('underscore')

export default {
  name: 'secret-listing',

  data () {
    return {
      showOwnedFilterOn: false,
      searchText: ''
    }
  },

  mounted () {
    if (_(this.secrets).isEmpty()) {
      this.loadSecretListing()
    }
  },

  computed: {

    ...mapGetters([
      'secrets',
      'coinbaseAddress',
      'marketContract',
      'computedGasLimit'
    ]),

    isFilteredSecretsEmpty: function () {
      return _(this.filteredSecrets).isEmpty()
    },

    filteredSecrets: function () {
      var regexp = new RegExp(this.searchText, 'g')

      var filteredByOwner = this.showOwnedFilterOn ? _(this.secrets).filter(secret => secret.owner === this.coinbaseAddress) : this.secrets
      var filteredByRegex = this.searchText === '' ? filteredByOwner : _(filteredByOwner).filter(secret => regexp.test(secret.title))

      return filteredByRegex
    }

  },

  watch: {

    'coinbaseAddress': function () {
      this.$store.dispatch('loadSecrets')
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
      this.computedGasLimit('default')
      .then(
        gasLimit => this.revealSecretCallback(
          [
            key,
            {
              from: this.coinbaseAddress,
              gas: gasLimit
            }
          ]
        )
      )
    },

    revealSecretCallback: function (transactionParams) {
      this.marketContract.revealSecret.call(...transactionParams)
      .then(([message]) => {
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
    background-color: #494e75;
    .secret-title, .secret-price, a {
      opacity: 1; color: white;
    }
  }
}

.secret-listing-actions {
  margin-bottom: 20px;
}

.placeholder {
  margin-bottom: 20px;
}

input, textarea {
  width: 40%; max-width: 400px;
}

</style>