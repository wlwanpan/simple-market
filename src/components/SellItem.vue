<template>
  <section id='sell-item'>
    <form>
      <div class="form-group">
        <label for="article_name">Article name</label>
        <input type="text" class="form-control" id="article_name" placeholder="Enter the name of your article">
      </div>
      <div class="form-group">
        <label for="price">Price in ETH</label>
        <input type="number" class="form-control" id="article_price" placeholder="1" pattern="[0-9]+([\.,][0-9]+)?" step="0.01">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea type="text" class="form-control" id="article_description" placeholder="Describe your article" maxlength="255"></textarea>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'sellItem',
  data () {
    return {
      form: {
      }
    }
  },
  beforeCreate: function () {
    // Users.init()
  },
  mounted: function () {
    console.log('Sell item form mounted')
  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>


</style>
