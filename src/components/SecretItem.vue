<template>
  <div class="secret-item-wrapper">

    <div class="secret-info">
      <div v-bind:class="rankClass" class="secret-rank"></div>
      <span class="secret-title">{{ data.title || 'No Title' }}</span>
      <span class="secret-price">| <strong>{{ priceInETH }}</strong> ETH</span>
    </div>

    <div class="secret-actions">
      <a v-if="data.owned" href="#" @click.prevent="$emit('reveal')">Reveal</a>
      <a v-else href="#" @click.prevent="buySecret">Buy</a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'secret-item',

  data () {
    return {
      secretState: 'available'
    }
  },

  props: [
    'data',
    'secretKey'
  ],

  computed: {

    priceInETH: function () {
      return window.web3.fromWei(this.data.price.toNumber(), 'ether')
    },

    rankClass: function () {
      var _rank = this.data.rank.toNumber()

      return {
        'good': _rank >= 7,
        'okay': _rank >= 4 && _rank < 7,
        'bad': _rank < 4
      }
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

      window.instance.buySecret(...data)
      .then((transaction) => {
        var { gasUsed, cumulativeGasUsed, blockNumber, transactionHash } = transaction.receipt

        this.$store.dispatch(
          'refreshModal',
          {
            options: {
              title: 'Purchase Successful',
              show: true,
              selectable: false
            },
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
  display: flex; justify-content: space-between;
  padding: 10px;
}

.secret-rank {
  display: inline-block; margin-right: 10px;
  width: 15px; height: 15px; float: left;
  border-radius: 50%;
  background: #ddd;

  &.good { background: #33cc99; }
  &.okay { background: #434c4f; }
  &.bad { background: #d61d4c; }
}

.secret-actions {
  margin-left: 10px;
}

</style>