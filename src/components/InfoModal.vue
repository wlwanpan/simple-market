<template>
<transition name="fade">

  <div class="modal-background" v-show="popup" @click="$emit('close')">
    <div class="modal-dialog" @click.stop>

      <h1>{{ title }}</h1>
      <ul class="details">
        <li v-for="(value, key) in properties">
          <div class="property-item">
            <strong>{{ key }}:</strong> {{ value }}
          </div>
        </li>
      </ul>

      <button class="button close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>

</transition>
</template>

<script>
export default {
  name: 'info-modal',

  props: [
    'popup',
    'properties',
    'title'
  ]

}
</script>

<style lang="scss" scoped>

h1 {
  border-bottom: 1px solid #ddd; opacity: 0.7;
  padding-bottom: 10px; padding-top: 0px;
  margin-top: 0;
}

.property-item {
  padding-bottom: 10px;
}

.modal-background {
  position: fixed; width: 100%; height: 100%; z-index: 999;
  top: 0; left: 0;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity 0.2s ease;
}

.modal-dialog {
  position: absolute;
  left: 50%;
  width: 600px;
  margin-left: -300px; margin-top: 100px;
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
}

.close-btn {
  width: 70%; font-size: 16px;
}

.details {
  padding: 0;
}

.fade-enter { opacity: 0; }
.fade-leave-active { transform: scale(0); }

</style>