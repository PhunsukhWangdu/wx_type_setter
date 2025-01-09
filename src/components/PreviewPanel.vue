<template>
  <div class="preview-panel">
    <div 
      v-if="isEditing"
      class="preview-editor"
      contenteditable="true"
      @input="handleInput"
      v-html="formattedContent"
    ></div>
    <div 
      v-else 
      class="preview-content"
      v-html="content"
    ></div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PreviewPanel',
  
  props: {
    content: {
      type: String,
      default: ''
    },
    formattedContent: {
      type: String,
      default: ''
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },

  emits: ['copy', 'update:formatted'],

  setup(props, { emit }) {
    const handleInput = (e) => {
      if (e.target) {
        emit('update:formatted', e.target.innerHTML)
      }
    }

    return {
      handleInput
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .preview-content,
  .preview-editor {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: white;
    
    :deep(*) {
      max-width: 100%;
    }

    :deep(h1) {
      margin-top: 0;
    }

    :deep(h2) {
      margin-top: 1.5em;
    }

    :deep(h3) {
      margin-top: 1.2em;
    }

    :deep(p) {
      margin: 1em 0;
    }

    :deep(ul), :deep(ol) {
      margin: 1em 0;
      padding-left: 2em;
    }

    :deep(li) {
      margin: 0.5em 0;
    }

    :deep(blockquote) {
      margin: 1em 0;
    }

    :deep(code) {
      font-family: monospace;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }

  .preview-editor {
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}
</style> 