  <template>

  <div v-if="selectable" class="item-wrapper selectable" @click="$emit('selected')">
    {{ itemValue }}
  </div>

  <div v-else class="item-wrapper">
    <strong>{{ itemKey }}:</strong> {{ itemValue }}
  </div>

</template>

<script>
export default {
  name: 'modal-item',

  props: [
    'selectable',
    'itemValue',
    'itemKey'
  ]
}
</script>

<style lang="scss" scoped>

.item-wrapper {
  margin-bottom: 5px; padding: 5px;
  opacity: 0.6;

  &.selectable:hover {
    cursor: pointer;
    background-color: rgba(15, 15, 15, 0.015);
    border-radius: 5px;
    opacity: 1;
  }
}

</style>