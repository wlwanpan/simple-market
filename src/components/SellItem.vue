<template>
  <section id='sell-item'>

    <div class="back-btn">
      <router-link to="/">Back</router-link>
    </div>

    <info-modal @close="closeInfoModal" :popup="displayInfoModal" :details="lastTransaction" title="Transaction Details">
    </info-modal>

    <form @submit.prevent="sellItem">

      <div class="form-group">
        <label for="article_name">Article name</label>
        <input v-model="formData.secretTitle" placeholder="Article Name">
      </div>

      <div class="form-group">
        <label for="price">Price in ETH</label>
        <input v-model.number="formData.secretPrice" type="number">
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="formData.secretMessage" placeholder="Article Description"></textarea>
      </div>

      <button type="submit">SELL</button>

    </form>
  </section>
</template>

<script>
import InfoModal from '@/components/InfoModal'

export default {
  name: 'sellItem',

  data () {
    return {
      displayInfoModal: false,
      gasLimit: 500000, // setting gas limit -> dynamic to change
      lastTransaction: null,
      formData: {
        secretTitle: '',
        secretPrice: 0
      }
    }
  },

  methods: {

    sellItem: function (e) {
      var seller = this.$store.getters.getCoinbaseAddress()
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
        this.lastTransaction = transaction
      })
      .then((secretKey) => {
        console.log('Secret sold secret key: ' + secretKey)
        // this.displayInfoModal = true
        this.resetFormData()
      })
      .catch(err => console.log(err))
    },

    closeInfoModal: function () {
      this.displayInfoModal = false
    },

    resetFormData: function () {
      this.formData.secretTitle = ''
      this.formData.secretMessage = ''
      this.formData.secretPrice = 0
    }

  },
  components: {
    InfoModal
  }
}
</script>

<style lang="scss" scoped>

input, textarea {
  width: 40%;
  margin: 10px; padding: 5px;
}

</style>
