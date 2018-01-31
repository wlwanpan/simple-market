<template>
<transition name="fade">

  <div class="modal-background" v-show="popup" @click="close">
    <div class="modal-dialog" @click.stop>

      <h1>{{ title }}</h1>
      <div class="details">
        {{ details }}
      </div>

      <button @click='close'>Close</button>
    </div>
  </div>

</transition>
</template>

<script>
export default {
  name: 'info-modal',

  props: [
    'popup',
    'title',
    'details'
  ],

  methods: {
    close: function (e) {
      this.$emit('close')
    }
  }

}
</script>

<style lang="scss" scoped>

h1 {
  border-bottom: 1px solid lightgrey;
  padding-bottom: 10px;
}

.modal-background {
  position: fixed; width: 100%; height: 100%; z-index: 999;
  top: 0; left: 0;
  background-color: rgba(0, 0, 0, .5);
  transition: all 0.3s ease;
}

.modal-dialog {
  position: absolute;
  left: 50%;
  width: 500px;
  margin-left: -250px; margin-top: 100px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
}

.fade-enter, .fade-leave-active { opacity: 0; }

</style>