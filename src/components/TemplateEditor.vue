<template>
  <div class="template-editor">
    <!-- 内置模板选择器 -->
    <div class="template-selector">
      <h4 class="section-title">选择模板风格</h4>
      <div class="template-list">
        <div 
          v-for="template in builtinTemplates" 
          :key="template.id"
          :class="['template-item', { active: selectedTemplate?.id === template.id }]"
          @click="applyBuiltinTemplate(template)"
        >
          <div class="template-preview">
            <img :src="template.preview" :alt="template.name">
          </div>
          <div class="template-info">
            <span class="template-name">{{ template.name }}</span>
            <span class="template-desc">{{ template.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-section">
      <h4 class="section-title">
        自定义模板
        <div class="mode-switch">
          <button 
            :class="['mode-btn', { active: mode === 'full' }]"
            @click="switchMode('full')"
          >
            完整模式
          </button>
          <button 
            :class="['mode-btn', { active: mode === 'tag' }]"
            @click="switchMode('tag')"
          >
            分离模式
          </button>
        </div>
      </h4>

      <!-- 完整模板模式 -->
      <div v-if="mode === 'full'" class="template-input">
        <div 
          ref="editorRef"
          class="editor-content" 
          contenteditable="true"
          @paste="handlePaste"
          @input="handleInput"
          placeholder="请粘贴参考模板HTML内容..."
        ></div>
      </div>

      <!-- 标签分离模式 -->
      <div v-else class="tag-inputs">
        <div v-for="tag in availableTags" :key="tag.name" class="tag-input-group">
          <div class="tag-header">
            <h4>{{ tag.label }}</h4>
            <span class="tag-name">{{ tag.name }}</span>
          </div>
          <div 
            :ref="el => tagEditors[tag.name] = el"
            class="tag-editor"
            contenteditable="true"
            @paste="e => handleTagPaste(e, tag.name)"
            @input="e => handleTagInput(e, tag.name)"
            :placeholder="tag.placeholder"
          ></div>
          <div v-if="tagStyles[tag.name]" class="tag-preview">
            <div class="preview-header">解析结果：</div>
            <div class="preview-content">
              <div class="style-info">
                <span class="label">样式:</span>
                <span class="value">{{ formatStyles(tagStyles[tag.name].styles) }}</span>
              </div>
              <div class="content-info">
                <span class="label">内容:</span>
                <span class="value">{{ tagStyles[tag.name].content || '无内容' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 解析结果展示 -->
    <div class="parse-info">
      <div class="info-header">
        <h4>模板解析结果：</h4>
        <button 
          class="toggle-info-btn"
          @click="showParseInfo = !showParseInfo"
        >
          {{ showParseInfo ? '隐藏' : '显示' }}
        </button>
      </div>
      <div v-if="showParseInfo" class="info-content">
        <div v-for="(info, tag) in parsedStyles" :key="tag" class="element-info">
          <div class="element-header">
            <span class="tag-name">{{ tag }}:</span>
            <span class="tag-count">{{ info.count }}个</span>
          </div>
          <div class="element-details">
            <div class="style-info">
              <span class="label">样式:</span>
              <span class="value">{{ formatStyles(info.styles?.[0]) }}</span>
            </div>
            <div class="content-info">
              <span class="label">内容:</span>
              <span class="value">{{ info.content || '无内容' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { extractStyles } from '../utils/parser'
import DOMPurify from 'dompurify'
import { BUILTIN_TEMPLATES } from '@/config/templates.js'

// 可用的标签配置
const AVAILABLE_TAGS = [
  { name: 'h1', label: '一级标题', placeholder: '粘贴一级标题的HTML...' },
  { name: 'h2', label: '二级标题', placeholder: '粘贴二级标题的HTML...' },
  { name: 'h3', label: '三级标题', placeholder: '粘贴三级标题的HTML...' },
  { name: 'h4', label: '四级标题', placeholder: '粘贴四级标题的HTML...' },
  { name: 'h5', label: '五级标题', placeholder: '粘贴五级标题的HTML...' },
  { name: 'h6', label: '六级标题', placeholder: '粘贴六级标题的HTML...' },
  { name: 'p', label: '段落', placeholder: '粘贴段落的HTML...' },
  { name: 'ul', label: '无序列表', placeholder: '粘贴无序列表的HTML...' },
  { name: 'ol', label: '有序列表', placeholder: '粘贴有序列表的HTML...' },
  { name: 'li', label: '列表项', placeholder: '粘贴列表项的HTML...' },
  { name: 'blockquote', label: '引用', placeholder: '粘贴引用的HTML...' },
  { name: 'code', label: '代码', placeholder: '粘贴代码的HTML...' },
  { name: 'strong', label: '加粗', placeholder: '粘贴加粗文本的HTML...' },
  { name: 'em', label: '斜体', placeholder: '粘贴斜体文本的HTML...' }
]

export default {
  name: 'TemplateEditor',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const mode = ref('full') // 'full' 或 'tag'
    const editorRef = ref(null)
    const tagEditors = ref({})
    const rawContent = ref('')
    const showParseInfo = ref(false)
    const parsedStyles = ref({})
    const tagStyles = ref({})
    
    const availableTags = ref(AVAILABLE_TAGS)
    const builtinTemplates = ref(BUILTIN_TEMPLATES)
    const selectedTemplate = ref(null)
    
    // 切换模式
    const switchMode = (newMode) => {
      mode.value = newMode
      if (newMode === 'tag') {
        // 如果有完整模板的内容，解析并填充到对应的标签输入框
        if (rawContent.value) {
          const container = document.createElement('div')
          container.innerHTML = rawContent.value
          
          availableTags.value.forEach(tag => {
            const elements = container.getElementsByTagName(tag.name)
            if (elements.length > 0) {
              const firstElement = elements[0]
              if (tagEditors.value[tag.name]) {
                tagEditors.value[tag.name].innerHTML = firstElement.outerHTML
                handleTagInput(null, tag.name)
              }
            }
          })
        }
      } else {
        // 从标签模式切换到完整模式，合并所有标签的内容
        const combinedContent = Object.entries(tagStyles.value)
          .map(([tag, info]) => info.html || '')
          .join('\n')
        
        if (editorRef.value) {
          editorRef.value.innerHTML = combinedContent
          handleInput()
        }
      }
    }

    // 处理单个标签的粘贴
    const handleTagPaste = (e, tagName) => {
      e.preventDefault()
      const html = e.clipboardData.getData('text/html')
      const text = e.clipboardData.getData('text')
      const content = html || text
      
      if (tagEditors.value[tagName]) {
        tagEditors.value[tagName].innerHTML = content
        handleTagInput(null, tagName)
      }
    }

    // 处理单个标签的输入
    const handleTagInput = async (e, tagName) => {
      const editor = tagEditors.value[tagName]
      if (!editor) return
      
      const html = editor.innerHTML
      if (!html) {
        tagStyles.value[tagName] = null
        return
      }

      try {
        const container = document.createElement('div')
        container.innerHTML = html
        
        const elements = container.getElementsByTagName(tagName)
        if (elements.length > 0) {
          const element = elements[0]
          const styleMap = await extractStyles(element.outerHTML)
          
          if (styleMap[tagName]?.[0]) {
            tagStyles.value[tagName] = {
              styles: styleMap[tagName][0].styles,
              content: element.textContent.trim(),
              html: element.outerHTML
            }
          }
        }
        
        // 更新完整的模板内容
        updateFullTemplate()
      } catch (error) {
        console.error(`Error parsing ${tagName} styles:`, error)
      }
    }

    // 更新完整的模板内容
    const updateFullTemplate = () => {
      const combinedContent = Object.entries(tagStyles.value)
        .map(([tag, info]) => info?.html || '')
        .join('\n')
      
      emit('update:modelValue', combinedContent)
    }

    const sanitizedContent = computed(() => {
      return DOMPurify.sanitize(rawContent.value, {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'blockquote', 'ul', 'ol', 'li', 'img', 'a'],
        ALLOWED_ATTR: ['style', 'href', 'src', 'alt', 'class']
      })
    })

    // 更新解析的样式
    const updateParsedStyles = async () => {
      if (!editorRef.value?.innerHTML) {
        parsedStyles.value = {}
        return
      }
      
      try {
        const styleMap = await extractStyles(editorRef.value.innerHTML)
        const result = {}
        
        // 获取所有标签的实际内容
        const container = document.createElement('div')
        container.innerHTML = editorRef.value.innerHTML
        
        Object.entries(styleMap).forEach(([tag, styles]) => {
          if (styles.length > 0) {
            // 获取该标签的第一个实例的文本内容
            const elements = container.getElementsByTagName(tag)
            const firstElement = elements[0]
            const content = firstElement ? firstElement.textContent.trim() : ''
            
            result[tag] = {
              count: styles.length,
              styles: styles.map(s => s.styles),
              tag: tag.toLowerCase(),
              content: content.length > 50 ? content.slice(0, 50) + '...' : content
            }
          }
        })
        
        parsedStyles.value = result
      } catch (error) {
        console.error('Error parsing styles:', error)
        parsedStyles.value = {}
      }
    }

    const formatStyles = (styles) => {
      if (!styles) return '无样式'
      const important = ['color', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign', 'backgroundColor']
      return Object.entries(styles)
        .filter(([key]) => important.includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
    }

    const handlePaste = (e) => {
      e.preventDefault()
      // 获取粘贴的HTML内容
      const html = e.clipboardData.getData('text/html')
      const text = e.clipboardData.getData('text')
      
      // 优先使用HTML格式
      const content = html || text
      
      // 将内容插入到编辑器
      document.execCommand('insertHTML', false, content)
      
      // 提取并处理内容
      const newContent = editorRef.value.innerHTML
      rawContent.value = newContent
      emit('update:modelValue', newContent)
      
      // 更新解析的样式
      updateParsedStyles()
    }

    const handleInput = () => {
      const newContent = editorRef.value.innerHTML
      rawContent.value = newContent
      emit('update:modelValue', newContent)
      
      // 更新解析的样式
      updateParsedStyles()
    }

    watch(() => props.modelValue, (newValue) => {
      if (editorRef.value && newValue !== editorRef.value.innerHTML) {
        editorRef.value.innerHTML = newValue
        rawContent.value = newValue
        // 更新解析的样式
        updateParsedStyles()
      }
    })

    // 应用内置模板
    const applyBuiltinTemplate = (template) => {
      selectedTemplate.value = template
      
      // 生成包含所有标签的示例内容
      const demoContent = `
        <h1 style="${styleToString(template.styles.h1)}">这是一级标题</h1>
        <h2 style="${styleToString(template.styles.h2)}">这是二级标题</h2>
        <h3 style="${styleToString(template.styles.h3)}">这是三级标题</h3>
        <p style="${styleToString(template.styles.p)}">这是第一个段落，展示了不同样式模板的排版效果。段落文字的颜色、大小、行高等都会随着模板变化而改变。</p>
        <blockquote style="${styleToString(template.styles.blockquote)}">这是一段引用文字，展示了不同风格的引用样式效果。</blockquote>
        <p style="${styleToString(template.styles.p)}">这是第二个段落，用来展示更多的文本效果。其中包含了<strong style="${styleToString(template.styles.strong)}">加粗文字</strong>和<em style="${styleToString(template.styles.em)}">斜体文字</em>。</p>
        <ul style="${styleToString(template.styles.ul)}">
          <li style="${styleToString(template.styles.li)}">这是无序列表项1</li>
          <li style="${styleToString(template.styles.li)}">这是无序列表项2</li>
        </ul>
        <ol style="${styleToString(template.styles.ol)}">
          <li style="${styleToString(template.styles.li)}">这是有序列表项1</li>
          <li style="${styleToString(template.styles.li)}">这是有序列表项2</li>
        </ol>
        <p style="${styleToString(template.styles.p)}">下面是一段代码示例：</p>
        <code style="${styleToString(template.styles.code)}">console.log("Hello, World!");</code>
      `
      
      if (mode.value === 'full') {
        // 完整模式下直接更新编辑器内容
        editorRef.value.innerHTML = demoContent
        handleInput()
      } else {
        // 分离模式下更新各个标签编辑器
        Object.entries(template.styles).forEach(([tag, styles]) => {
          if (tagEditors.value[tag]) {
            const html = generateTagHtml(tag, styles)
            tagEditors.value[tag].innerHTML = html
            handleTagInput(null, tag)
          }
        })
      }
      
      // 触发更新
      emit('update:modelValue', demoContent)
    }

    // 辅助函数：将样式对象转换为样式字符串
    const styleToString = (styles) => {
      if (!styles) return ''
      return Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')
    }

    // 生成单个标签的HTML
    const generateTagHtml = (tag, styles) => {
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')
      
      const content = getDefaultContent(tag)
      return `<${tag} style="${styleString}">${content}</${tag}>`
    }

    // 获取标签的默认示例内容
    const getDefaultContent = (tag) => {
      const contentMap = {
        h1: '这是一级标题',
        h2: '这是二级标题',
        h3: '这是三级标题',
        h4: '这是四级标题',
        p: '这是一个段落示例，展示了不同样式模板的排版效果。段落文字的颜色、大小、行高等都会随着模板变化而改变。',
        blockquote: '这是一段引用文字，展示了不同风格的引用样式效果。',
        ul: '<li>这是无序列表项1</li><li>这是无序列表项2</li>',
        ol: '<li>这是有序列表项1</li><li>这是有序列表项2</li>',
        li: '列表项内容',
        code: 'console.log("这是一段代码");',
        strong: '这是加粗的文字',
        em: '这是斜体文字'
      }
      return contentMap[tag] || `${tag} 内容示例`
    }

    return {
      mode,
      editorRef,
      tagEditors,
      availableTags,
      tagStyles,
      showParseInfo,
      parsedStyles,
      switchMode,
      handleTagPaste,
      handleTagInput,
      formatStyles,
      sanitizedContent,
      handlePaste,
      handleInput,
      builtinTemplates,
      selectedTemplate,
      applyBuiltinTemplate
    }
  }
}
</script>

<style lang="scss" scoped>
.template-editor {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
  flex-direction: column;
  
  .template-input, .template-preview {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .editor-content {
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow-y: auto;
    background: white;
    font-size: 16px;
    line-height: 1.6;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &[contenteditable=true]:empty:before {
      content: attr(placeholder);
      color: #999;
      font-style: italic;
    }
  }

  .preview-content {
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow-y: auto;
    background: white;

    :deep(img) {
      max-width: 100%;
      height: auto;
    }

    :deep(p) {
      margin: 1em 0;
    }

    :deep(h1, h2, h3, h4, h5, h6) {
      margin: 1.2em 0 0.6em;
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
        padding: 8px;
        border-bottom: 1px solid #eee;
        
        &:last-child {
          border-bottom: none;
        }

        .element-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;

          .tag-name {
            font-family: monospace;
            color: #d63384;
            min-width: 40px;
            font-weight: bold;
          }

          .tag-count {
            color: #0d6efd;
            min-width: 40px;
          }
        }

        .element-details {
          margin-left: 50px;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .style-info,
          .content-info {
            display: flex;
            gap: 8px;
            align-items: flex-start;

            .label {
              color: #666;
              min-width: 45px;
            }

            .value {
              color: #333;
              flex: 1;
              word-break: break-all;
              font-family: monospace;
              background: #fff;
              padding: 2px 6px;
              border-radius: 3px;
              border: 1px solid #e0e0e0;
            }
          }
        }
      }
    }
  }

  .mode-switch {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;

    .mode-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
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

  .tag-inputs {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .tag-input-group {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);

      .tag-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        h4 {
          margin: 0;
          font-size: 14px;
          color: var(--text-color);
        }

        .tag-name {
          font-family: monospace;
          color: #d63384;
          font-size: 12px;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 3px;
        }
      }

      .tag-editor {
        min-height: 60px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.6;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        &[contenteditable=true]:empty:before {
          content: attr(placeholder);
          color: #999;
          font-style: italic;
        }
      }

      .tag-preview {
        background: #f8f9fa;
        border-radius: 4px;
        padding: 10px;

        .preview-header {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .style-info,
          .content-info {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            font-size: 12px;

            .label {
              color: #666;
              min-width: 45px;
            }

            .value {
              flex: 1;
              word-break: break-all;
              font-family: monospace;
              background: white;
              padding: 2px 6px;
              border-radius: 3px;
              border: 1px solid #e0e0e0;
            }
          }
        }
      }
    }
  }

  .section-title {
    font-size: 16px;
    color: var(--text-color);
    margin: 0 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .template-selector {
    .template-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;

      .template-item {
        border: 2px solid transparent;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        background: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        &.active {
          border-color: var(--primary-color);
        }

        .template-preview {
          height: 120px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .template-info {
          padding: 12px;
          
          .template-name {
            display: block;
            font-weight: 500;
            margin-bottom: 4px;
          }
          
          .template-desc {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}
</style> 