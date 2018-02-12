<template>
  <div class="secret-item-wrapper">

    <div class="secret-info">
      Rank: {{ data.rank }} - {{ data.title }} - {{ priceInETH }} ETH
    </div>

    <div class="secret-actions">
      <a v-if="data.owned" href="#" @click="$emit('reveal')">Reveal</a>
      <a v-else href="#" @click="buySecret">Buy</a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'secret-item',

  props: [
    'data',
    'secretKey'
  ],

  computed: {
    priceInETH: function () {
      return window.web3.fromWei(this.data.price.toNumber(), 'ether')
    }
  },

  methods: {
    buySecret: function (e) {
      var seller = this.$store.getters.getCoinbaseAddress()
      var data = [
        this.secretKey,
        {
          from: seller,
          gas: 500000,
          value: this.data.price
        }
      ]

      this.$store.getters.getMarketContractInstance().buySecret(...data)
      .then((transaction) => {
        var { gasUsed, cumulativeGasUsed, blockNumber, transactionHash } = transaction.receipt

        this.$store.dispatch(
          'refreshModal',
          {
            title: 'Purchase Successful',
            show: true,
            data: {
              gasUsed,
              cumulativeGasUsed,
              blockNumber,
              transactionHash
            }
          }
        )
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

</style>