import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 需要提取的样式属性列表
const STYLE_PROPERTIES = [
  'color',
  'backgroundColor',
  'fontSize',
  'lineHeight',
  'fontWeight',
  'fontFamily',
  'textAlign',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'borderRadius',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'textDecoration',
  'letterSpacing',
  'textIndent',
  'listStyleType',
  'display'
]

// 提取样式的辅助函数
function getComputedStylesForElement(element) {
  const computedStyle = window.getComputedStyle(element)
  const styles = {}

  STYLE_PROPERTIES.forEach(prop => {
    const value = computedStyle[prop]
    // 保留所有颜色值，即使是默认值
    if (prop === 'color' || prop === 'backgroundColor') {
      styles[prop] = value
    } 
    // 对于其他属性，过滤掉默认值
    else if (value && value !== '0px' && value !== 'none' && value !== 'normal') {
      styles[prop] = value
    }
  })

  return styles
}

// 从模板中提取样式映射
export function extractStyles(template) {
  // 创建一个隐藏的容器来渲染模板
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = '800px' // 设置固定宽度以确保样式计算正确
  container.innerHTML = template
  document.body.appendChild(container)

  // 等待样式计算完成
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const styleMap = {
        p: [], // 段落样式
        h1: [], // 一级标题
        h2: [], // 二级标题
        h3: [], // 三级标题
        h4: [], // 四级标题
        h5: [], // 五级标题
        h6: [], // 六级标题
        ul: [], // 无序列表
        ol: [], // 有序列表
        li: [], // 列表项
        blockquote: [], // 引用
        code: [], // 代码块
        strong: [], // 加粗
        em: [], // 斜体
        a: [] // 链接
      }

      // 遍历所有元素并提取样式
      Object.keys(styleMap).forEach(tag => {
        const elements = container.getElementsByTagName(tag)
        Array.from(elements).forEach((el, index) => {
          const styles = getComputedStylesForElement(el)
          // 移除这个条件，保存所有样式信息
          styleMap[tag].push({
            styles,
            classes: Array.from(el.classList),
            inlineStyle: el.getAttribute('style') || '',
            index
          })
        })
      })

      document.body.removeChild(container)
      resolve(styleMap)
    })
  })
}

// 将 Markdown 转换为 HTML 并应用样式
export async function parseTemplate(markdownContent, templateHtml) {
  // 首先将 Markdown 转换为基础 HTML
  const baseHtml = md.render(markdownContent)
  
  if (!templateHtml) {
    return baseHtml
  }

  try {
    // 提取模板中的样式
    const styleMap = await extractStyles(templateHtml)
    
    // 创建临时容器来处理 HTML
    const container = document.createElement('div')
    container.innerHTML = baseHtml

    // 遍历并应用样式
    Object.keys(styleMap).forEach(tag => {
      const elements = container.getElementsByTagName(tag)
      const templateStyles = styleMap[tag]
      
      if (templateStyles.length > 0) {
        Array.from(elements).forEach((el, index) => {
          // 尝试匹配相同位置的样式，如果没有则使用第一个样式
          const styleInfo = templateStyles[index] || templateStyles[0]
          
          if (styleInfo?.styles) {
            // 应用样式
            Object.entries(styleInfo.styles).forEach(([prop, value]) => {
              // 确保颜色值被正确应用
              if (prop === 'color' || prop === 'backgroundColor') {
                el.style[prop] = value
              } else {
                // 只在值不为空时应用其他样式
                if (value) {
                  el.style[prop] = value
                }
              }
            })
            
            // 应用类名
            if (styleInfo.classes.length > 0) {
              el.classList.add(...styleInfo.classes)
            }
          }
        })
      }
    })

    // 处理嵌套元素的样式继承
    const processNestedElements = (element) => {
      const children = element.children
      if (children.length > 0) {
        Array.from(children).forEach(child => {
          const parentStyles = window.getComputedStyle(element)
          const inheritedStyles = ['color', 'fontSize', 'fontFamily', 'lineHeight']
          
          inheritedStyles.forEach(style => {
            if (!child.style[style]) {
              child.style[style] = parentStyles[style]
            }
          })
          
          processNestedElements(child)
        })
      }
    }

    processNestedElements(container)

    return container.innerHTML
  } catch (error) {
    console.error('Error parsing template:', error)
    return baseHtml
  }
}

// 应用模板样式到 Markdown 内容
export function applyTemplateStyles(markdownContent, templateStyles) {
  // 先将 Markdown 转换为基础 HTML
  const baseHtml = md.render(markdownContent)
  
  // 创建临时容器
  const container = document.createElement('div')
  container.innerHTML = baseHtml
  
  // 遍历所有标签并应用样式
  Object.entries(templateStyles).forEach(([tag, styles]) => {
    const elements = container.getElementsByTagName(tag)
    Array.from(elements).forEach(el => {
      // 直接应用每个样式属性
      Object.entries(styles).forEach(([key, value]) => {
        try {
          // 处理特殊的样式属性
          if (key === 'borderLeft') {
            const [width, style, color] = value.split(' ')
            el.style.borderLeftWidth = width
            el.style.borderLeftStyle = style
            el.style.borderLeftColor = color
          } else {
            el.style[key] = value
          }
        } catch (error) {
          console.warn(`Failed to apply style ${key}: ${value}`, error)
        }
      })
    })
  })

  // 处理嵌套元素的样式继承
  const processNestedElements = (element) => {
    const children = element.children
    if (children.length > 0) {
      Array.from(children).forEach(child => {
        const parentStyles = window.getComputedStyle(element)
        const inheritedStyles = [
          'color', 'fontSize', 'fontFamily', 'lineHeight',
          'textAlign', 'fontWeight', 'letterSpacing'
        ]
        
        inheritedStyles.forEach(style => {
          if (!child.style[style]) {
            child.style[style] = parentStyles[style]
          }
        })
        
        processNestedElements(child)
      })
    }
  }

  processNestedElements(container)
  
  return container.innerHTML
} 