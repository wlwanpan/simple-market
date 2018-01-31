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
        <input v-model="formData.articleName" placeholder="Article Name">
      </div>

      <div class="form-group">
        <label for="price">Price in ETH</label>
        <input v-model.number="formData.articlePrice" type="number">
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="formData.articleDescription" placeholder="Article Description"></textarea>
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
      lastTransactionHash: '0x0',
      transactionHistory: {},
      formData: {
        articleDescription: '',
        articleName: '',
        articlePrice: 0
      }
    }
  },

  computed: {

    lastTransaction: function () {
      // var lastTransaction = this.transactionHistory[this.lastTransactionHash]
      return {}
    }

  },

  methods: {

    sellItem: function (e) {
      var seller = this.$store.getters.getCoinbaseAddress()
      var articleData = [
        this.formData.articleName,
        this.formData.articleDescription,
        window.web3.toWei(this.formData.articlePrice, 'ether'),
        {
          from: seller,
          gas: this.gasLimit
        }
      ]
      this.$store.dispatch('deployMarketContract')
      .then((instance) => {
        return instance.sellArticle(...articleData)
      })
      .then((transaction) => {
        this.lastTransactionHash = transaction.tx

        this.$store.dispatch({
          type: 'saveTransactionData',
          transaction
        })
        .then((transactionHistory) => {
          this.transactionHistory = transactionHistory
          this.displayInfoModal = true
          this.resetFormData()
        })
      })
    },

    closeInfoModal: function () {
      this.displayInfoModal = false
    },

    resetFormData: function () {
      this.formData.articleName = ''
      this.formData.articleDescription = ''
      this.formData.articlePrice = 0
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
