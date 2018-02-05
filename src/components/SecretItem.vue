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
    'price'
  ],

  computed: {
    priceInETH: function () {
      return window.web3.fromWei(this.price.toNumber(), 'ether')
    }
  },

  methods: {
    buySecret: function (e) {
      console.log('Buy called of: ' + this.title)
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