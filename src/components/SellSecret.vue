<template>
  <section id='sell-secret'>

    <div class="general-actions back-btn">
      <router-link class="button" to="/">Back</router-link>
    </div>

    <form @submit.prevent="sellItem">

      <div class="form-group">
        <div class="form-label">Title</div>
        <input v-model="formData.secretTitle" placeholder="Enter a summary for your secret.">
      </div>

      <div class="form-group">
        <div class="form-label">Price in ETH</div>
        <input id="price" v-model.number="formData.secretPrice" type="number">
      </div>

      <div class="form-group">
        <div class="form-label">Secret</div>
        <textarea maxlength="155" v-model="formData.secretMessage" placeholder="Secret message you want to auction"></textarea>
      </div>

      <button class="button sell-btn" type="submit">SELL</button>

    </form>

  </section>
</template>

<script>
export default {
  name: 'sellSecret',

  data () {
    return {
      gasLimit: 500000, // setting gas limit -> dynamic to change
      formData: {
        secretPrice: window.web3.toBigNumber(0),
        transactionHash: '0x0'
      }
    }
  },

  methods: {

    sellItem: function (e) {
      var seller = this.$store.getters.getCoinbaseAddress()
      // var seller = '0xea5a6266b8797709b68485d0dae3bc56c6a0f91d' // Another account to test seller
      var data = [
        this.formData.secretTitle,
        this.formData.secretMessage,
        window.web3.toWei(this.formData.secretPrice, 'ether'),
        {
          from: seller,
          gas: this.gasLimit
        }
      ]

      this.$store.getters.getMarketContractInstance().sellSecret(...data)
      .then((transaction) => {
        var { gasUsed, cumulativeGasUsed, blockNumber, transactionHash } = transaction.receipt

        this.$store.dispatch(
          'refreshModal',
          {
            title: 'Secret Auction Successful',
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
      .then((secretKey) => {
        this.resetFormData()
      })
      .catch(err => window.alert(err))
    },

    resetFormData: function () {
      this.formData.secretTitle = ''
      this.formData.secretMessage = ''
      this.formData.secretPrice = 0
    }

  }
}
</script>

<style lang="scss" scoped>

#sell-secret {
  width: 70%; margin: 0 auto;
}

.form-group {
  padding: 10px;
  .form-label {
    width: 70%; margin: 0 auto;
    font-size: 20px; font-weight: 400;
    color: #42b983; text-align: left;
  }
}

.sell-btn {
  color: #42b983; width: 70%; font-size: 15px;
}

input, textarea {
  margin: 5px; padding: 5px;
  font-size: 15px; width: 70%;
  resize: none; border: none;
  border-bottom: 1px solid #ddd;
  &:focus {
    outline: none;
    border-bottom: 1px solid #42b983;
  }

  &::-webkit-input-placeholder {
    transition: opacity 0.4s;
    opacity: 0.8;
  }
  &:focus::-webkit-input-placeholder {
    opacity: 0.2;
  }
}

</style>
