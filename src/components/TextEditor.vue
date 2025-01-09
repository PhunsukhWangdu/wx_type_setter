<template>
  <div class="text-editor">
    <div class="editor-toolbar">
      <div class="markdown-hint">支持 Markdown 格式</div>
      <div class="view-toggle">
        <button 
          :class="['toggle-btn', { active: view === 'edit' }]"
          @click="view = 'edit'"
        >
          编辑
        </button>
        <button 
          :class="['toggle-btn', { active: view === 'preview' }]"
          @click="view = 'preview'"
        >
          预览
        </button>
      </div>
    </div>
    <div class="editor-content">
      <textarea
        v-show="view === 'edit'"
        ref="textarea"
        v-model="localContent"
        class="editor-textarea"
        placeholder="请输入文章内容（支持 Markdown 格式）..."
        @input="handleInput"
        @paste="handlePaste"
      ></textarea>
      <div 
        v-show="view === 'preview'"
        class="markdown-preview"
        v-html="previewHtml"
      ></div>
    </div>
    <div class="parse-info">
      <div class="info-header">
        <h4>解析结果：</h4>
        <button 
          class="toggle-info-btn"
          @click="showParseInfo = !showParseInfo"
        >
          {{ showParseInfo ? '隐藏' : '显示' }}
        </button>
      </div>
      <div v-if="showParseInfo" class="info-content">
        <div v-for="(count, tag) in parsedElements" :key="tag" class="element-info">
          <span class="tag-name">{{ tag }}:</span>
          <span class="tag-count">{{ count }}个</span>
          <span class="tag-example" v-if="firstExample[tag]">
            示例：{{ firstExample[tag] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

export default {
  name: 'TextEditor',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const localContent = ref(props.modelValue)
    const view = ref('edit')
    const textarea = ref(null)
    const showParseInfo = ref(false)

    // 解析 HTML 并统计元素
    const parseHtmlContent = (html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      
      const elements = {}
      const examples = {}
      
      // 要统计的标签类型
      const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'strong', 'em']
      
      tags.forEach(tag => {
        const els = container.getElementsByTagName(tag)
        if (els.length > 0) {
          elements[tag] = els.length
          // 保存第一个元素的文本内容作为示例
          examples[tag] = els[0].textContent.slice(0, 20) + (els[0].textContent.length > 20 ? '...' : '')
        }
      })
      
      return { elements, examples }
    }

    const previewHtml = computed(() => {
      return md.render(localContent.value || '')
    })

    const parsedElements = computed(() => {
      const { elements } = parseHtmlContent(previewHtml.value)
      return elements
    })

    const firstExample = computed(() => {
      const { examples } = parseHtmlContent(previewHtml.value)
      return examples
    })

    watch(() => props.modelValue, (newValue) => {
      if (newValue !== localContent.value) {
        localContent.value = newValue
      }
    })

    const handleInput = () => {
      emit('update:modelValue', localContent.value)
    }

    const handlePaste = (e) => {
      // 如果粘贴的是 Markdown 格式的文本，直接使用
      const text = e.clipboardData.getData('text/plain')
      if (text) {
        e.preventDefault()
        // 获取当前光标位置
        const start = textarea.value.selectionStart
        const end = textarea.value.selectionEnd
        // 在光标位置插入文本
        const newContent = 
          localContent.value.substring(0, start) + 
          text + 
          localContent.value.substring(end)
        localContent.value = newContent
        // 更新光标位置
        textarea.value.selectionStart = textarea.value.selectionEnd = start + text.length
        handleInput()
      }
    }

    return {
      localContent,
      view,
      textarea,
      previewHtml,
      showParseInfo,
      parsedElements,
      firstExample,
      handleInput,
      handlePaste
    }
  }
}
</script>

<style lang="scss" scoped>
.text-editor {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
  .editor-toolbar {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .markdown-hint {
      color: #666;
      font-size: 14px;
      font-style: italic;
    }

    .view-toggle {
      display: flex;
      gap: 5px;

      .toggle-btn {
        padding: 4px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        &:hover:not(.active) {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
      }
    }
  }

  .editor-content {
    flex: 1;
    display: flex;
    position: relative;
  }
  
  .editor-textarea {
    flex: 1;
    width: 100%;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
    font-size: 16px;
    line-height: 1.6;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }

  .markdown-preview {
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow-y: auto;
    background: white;

    :deep(h1) {
      font-size: 2em;
      margin: 0.67em 0;
    }

    :deep(h2) {
      font-size: 1.5em;
      margin: 0.83em 0;
    }

    :deep(h3) {
      font-size: 1.17em;
      margin: 1em 0;
    }

    :deep(h4) {
      font-size: 1em;
      margin: 1.33em 0;
    }

    :deep(h5) {
      font-size: 0.83em;
      margin: 1.67em 0;
    }

    :deep(h6) {
      font-size: 0.67em;
      margin: 2.33em 0;
    }

    :deep(p) {
      margin: 1em 0;
    }

    :deep(ul), :deep(ol) {
      padding-left: 2em;
      margin: 1em 0;
    }

    :deep(blockquote) {
      margin: 1em 0;
      padding-left: 1em;
      border-left: 4px solid #ddd;
      color: #666;
    }

    :deep(code) {
      font-family: monospace;
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
    }

    :deep(pre) {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
  }

  .parse-info {
    margin-top: 15px;
    border-top: 1px solid #eee;
    padding-top: 15px;

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      h4 {
        margin: 0;
        color: var(--text-color);
        font-size: 14px;
      }

      .toggle-info-btn {
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
      }
    }

    .info-content {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 10px;
      font-size: 13px;

      .element-info {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        gap: 10px;

        .tag-name {
          font-family: monospace;
          color: #d63384;
          min-width: 40px;
        }

        .tag-count {
          color: #0d6efd;
          min-width: 40px;
        }

        .tag-example {
          color: #666;
          font-style: italic;
        }
      }
    }
  }
}
</style> 