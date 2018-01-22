<template>
  <div class="dashboard">
    <h1>{{ title }}</h1>
    <div v-if="coinbaseAddressExist">
      Welcome {{ pseudo }}. Destroy your account by clicking <a href="#" @click="destroyAccount">here</a>.
    </div>
    <div v-else>Sign up <router-link to="/sellItem">Sell an item</router-link>.</div>
  </div>
</template>

<script>

export default {
  name: 'dashboard',
  data () {
    return {
      title: 'Simple Market',
      pseudo: undefined
    }
  },
  computed: {
    coinbaseAddressExist: function () {

    }
  },
  beforeCreate: function () {
    this.$store.dispatch('initCoinbaseAddress')
  },
  mounted: function () {

  },
  methods: {
    destroyAccount: function (e) {

    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
  display: block;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
