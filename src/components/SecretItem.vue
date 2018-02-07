<template>
  <div class="secret-item-wrapper">

    <div class="secret-info">
      {{ title }} - {{ priceInETH }} ETH
    </div>

    <div class="secret-actions">
      <a href="#" @click="buySecret">Buy</a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'secret-item',

  props: [
    'title',
    'price',
    'keyHash'
  ],

  computed: {
    priceInETH: function () {
      return window.web3.fromWei(this.price.toNumber(), 'ether')
    }
  },

  methods: {
    buySecret: function (e) {
      var seller = this.$store.getters.getCoinbaseAddress()
      var data = [
        this.keyHash,
        {
          from: seller,
          gas: 500000
        }
      ]

      this.$store.getters.getMarketContractInstance().buyArticle(...data)
      .then(() => {
        this.$store.dispatch('refreshOwnedSecrets')
      })
      .catch((err) => {
        window.alert(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.secret-item-wrapper {
  display: flex; justify-content: center;
  padding: 10px;
}

.secret-actions {
  margin-left: 10px;
}

</style>>