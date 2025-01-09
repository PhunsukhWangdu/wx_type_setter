import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer = null

export function useToast() {
  const showToast = (msg, duration = 3000) => {
    message.value = msg
    visible.value = true
    
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return {
    visible,
    message,
    showToast
  }
} 