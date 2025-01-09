<template>
  <transition name="toast">
    <div v-if="visible" class="toast">
      {{ message }}
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Toast',
  
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup() {
    const visible = ref(false)

    return {
      visible
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style> 