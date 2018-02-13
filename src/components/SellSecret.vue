<template>
  <section id='sell-secret'>

    <div class="sell-secret-header">
      Auction your secret message by filling up the form below. Once published,
      the message will be immutable and live indefinetely on the network,
      until it has been revealed at least 10 times.
    </div>

    <router-link class="button back-btn" to="/">Back</router-link>

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
      // var seller = '0x772d8a2ed99eb72c9a97ab70a82ccc9428bda795' // Another account to test seller
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
  width: 70%; max-width: 600px;
  margin: 0 auto;
}

.sell-secret-header {
  width: 70%; margin: 0 auto; padding: 15px;
  margin-bottom: 15px;
  background-color: rgba(15, 15, 15, 0.015);
  border-radius: 5px;
}

.form-group {
  padding: 10px;
  .form-label {
    width: 70%; margin: 0 auto; text-align: left;
    font-size: 20px; font-weight: 500;
    opacity: 0.7;
  }
}

.back-btn {
  display: inline-block; width: 62%; font-size: 15px;
  margin-bottom: 15px; margin-top: 7px;
}

.sell-btn {
  width: 70%; font-size: 15px;
  margin-top: 15px;
}

input, textarea {
  width: 70%;
}

</style>
