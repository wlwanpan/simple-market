<template>
  <section id='sell-item'>
    <div class="back-btn">
      <router-link to="/">Back</router-link>
    </div>

    <form @submit.prevent="sellItem">

      <div class="form-group">
        <label for="article_name">Article name</label>
        <input v-model="articleName" placeholder="Article Name">
      </div>

      <div class="form-group">
        <label for="price">Price in ETH</label>
        <input v-model.number="articlePrice" type="number" placeholder="Article Name">
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="articleDescription" placeholder="Article Description"></textarea>
      </div>

      <button type="submit">SELL</button>

    </form>
  </section>
</template>

<script>
export default {
  name: 'sellItem',

  data () {
    return {
      articleName: '',
      articlePrice: 0,
      articleDescription: ''
    }
  },

  beforeCreate: function () {
    // Users.init()
  },

  mounted: function () {
    console.log('Sell item form mounted')
  },

  methods: {
    sellItem: function (e) {
      console.log(this)
    }
  }
}

</script>

<style lang="scss" scoped>

input, textarea {
  margin: 10px;
  padding: 5px;
  width: 40%;
}

</style>
