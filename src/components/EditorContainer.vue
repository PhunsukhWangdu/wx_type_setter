<template>
  <div class="editor-container">
    <div class="editor-section">
      <div class="editor-header">
        <h3>文章内容编辑</h3>
      </div>
      <text-editor
        v-model="content"
        @update:modelValue="handleContentUpdate"
      />
    </div>

    <div class="template-section">
      <div class="editor-header">
        <h3>样式模板</h3>
        <button 
          class="clear-btn"
          @click="clearTemplate"
        >
          清除模板
        </button>
      </div>
      <template-editor
        ref="templateEditor"
        v-model="templateHtml"
        @update:modelValue="handleTemplateUpdate"
      />
    </div>

    <div class="preview-section">
      <div class="editor-header">
        <h3>预览效果</h3>
        <div class="action-buttons">
          <button 
            class="apply-btn"
            @click="applyTemplate"
            :disabled="!content || !templateHtml"
          >
            确认生成
          </button>
          <button 
            class="edit-btn"
            v-if="formattedContent"
            @click="editFormatted"
          >
            调整样式
          </button>
        </div>
      </div>
      <preview-panel
        :content="previewContent"
        :formatted-content="formattedContent"
        :is-editing="isEditing"
        @update:formatted="updateFormattedContent"
        @copy="handleCopy"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import TextEditor from './TextEditor.vue'
import TemplateEditor from './TemplateEditor.vue'
import PreviewPanel from './PreviewPanel.vue'
import { parseTemplate, applyTemplateStyles } from '../utils/parser'
import { useToast } from '../composables/useToast'

export default {
  name: 'EditorContainer',
  
  components: {
    TextEditor,
    TemplateEditor,
    PreviewPanel
  },

  setup() {
    const { showToast } = useToast()
    const content = ref('')
    const templateHtml = ref('')
    const previewContent = ref('')
    const formattedContent = ref('')
    const isEditing = ref(false)
    const templateEditor = ref(null)

    const handleContentUpdate = (newContent) => {
      content.value = newContent
      // 不再自动更新预览，而是显示原始内容
      previewContent.value = newContent
    }

    const handleTemplateUpdate = (newTemplate) => {
      templateHtml.value = newTemplate
    }

    const applyTemplate = async () => {
      try {
        const markdownContent = content.value
        let formattedHtml = ''

        // 如果有选中的模板，使用模板样式
        if (templateEditor.value?.selectedTemplate) {
          const template = templateEditor.value.selectedTemplate
          formattedHtml = await applyTemplateStyles(markdownContent, template.styles)
        } else {
          formattedHtml = await parseTemplate(markdownContent, templateHtml.value)
        }

        // 更新预览内容
        formattedContent.value = formattedHtml
        previewContent.value = formattedHtml
        showToast('内容格式化成功！')
      } catch (err) {
        console.error('Format error:', err)
        showToast('格式化失败，请检查内容格式')
      }
    }

    const editFormatted = () => {
      isEditing.value = true
    }

    const updateFormattedContent = (newContent) => {
      formattedContent.value = newContent
      previewContent.value = newContent
    }

    const clearTemplate = () => {
      templateHtml.value = ''
      if (formattedContent.value) {
        previewContent.value = content.value
        formattedContent.value = ''
      }
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(previewContent.value)
        showToast('复制成功！')
      } catch (err) {
        showToast('复制失败，请重试')
      }
    }

    return {
      content,
      templateHtml,
      previewContent,
      formattedContent,
      isEditing,
      handleContentUpdate,
      handleTemplateUpdate,
      applyTemplate,
      editFormatted,
      updateFormattedContent,
      clearTemplate,
      handleCopy,
      templateEditor
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  min-height: 600px;

  .editor-section,
  .template-section,
  .preview-section {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
  }

  .editor-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .clear-btn,
    .apply-btn,
    .edit-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: #f5f5f5;
        color: var(--primary-color);
        border-color: var(--primary-color);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .apply-btn {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);

      &:hover:not(:disabled) {
        background: #06a954;
        color: white;
      }
    }
  }
}
</style> 