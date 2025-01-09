import modernPreview from '@/assets/templates/modern-preview.jpg';
import classicPreview from '@/assets/templates/classic-preview.jpg';
import techPreview from '@/assets/templates/tech-preview.jpg';
import blogPreview from '@/assets/templates/blog-preview.jpg';
import minimalPreview from '@/assets/templates/minimal-preview.jpg';

export const BUILTIN_TEMPLATES = [
  {
    id: 'modern',
    name: '现代简约',
    description: '清新优雅的现代风格',
    preview: modernPreview,
    styles: {
      h1: { 
        fontSize: '2.5em', 
        color: '#2c3e50', 
        fontWeight: '600', 
        marginBottom: '1em',
        lineHeight: '1.2',
        letterSpacing: '-0.02em'
      },
      h2: { 
        fontSize: '2em', 
        color: '#34495e', 
        fontWeight: '500', 
        marginTop: '1.5em',
        marginBottom: '0.8em',
        lineHeight: '1.3'
      },
      h3: { 
        fontSize: '1.5em', 
        color: '#445566', 
        fontWeight: '500', 
        marginTop: '1.2em',
        marginBottom: '0.6em'
      },
      h4: { 
        fontSize: '1.25em', 
        color: '#556677', 
        fontWeight: '500', 
        marginTop: '1em',
        marginBottom: '0.5em'
      },
      p: { 
        fontSize: '1.1em', 
        lineHeight: '1.8', 
        color: '#3a4145', 
        marginBottom: '1.2em',
        letterSpacing: '0.01em'
      },
      ul: { 
        marginLeft: '1.5em', 
        marginBottom: '1.2em', 
        lineHeight: '1.6',
        color: '#3a4145'
      },
      ol: { 
        marginLeft: '1.5em', 
        marginBottom: '1.2em', 
        lineHeight: '1.6',
        color: '#3a4145'
      },
      li: { 
        marginBottom: '0.5em',
        fontSize: '1.1em'
      },
      blockquote: { 
        borderLeft: '4px solid #3498db',
        paddingLeft: '1.2em',
        marginLeft: '0',
        marginRight: '0',
        marginBottom: '1.2em',
        color: '#5a6a7a',
        fontStyle: 'italic'
      },
      code: { 
        backgroundColor: '#f8f9fa',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontSize: '0.9em',
        color: '#e83e8c',
        fontFamily: 'monospace'
      },
      strong: { 
        fontWeight: '600',
        color: '#2c3e50'
      },
      em: { 
        fontStyle: 'italic',
        color: '#34495e'
      }
    }
  },
  {
    id: 'classic',
    name: '学术文档',
    description: '专业的学术论文排版风格',
    preview: classicPreview,
    styles: {
      h1: {
        fontSize: '2em',
        color: '#1a1a1a',
        fontWeight: '600',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginBottom: '1em',
        marginTop: '1.5em',
        lineHeight: '1.3',
        letterSpacing: '-0.02em'
      },
      h2: {
        fontSize: '1.5em',
        color: '#2a2a2a',
        fontWeight: '600',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginTop: '2em',
        marginBottom: '1em',
        lineHeight: '1.4',
        letterSpacing: '-0.01em',
        borderBottom: '1px solid #eaecef',
        paddingBottom: '0.3em'
      },
      h3: {
        fontSize: '1.25em',
        color: '#333',
        fontWeight: '600',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginTop: '1.5em',
        marginBottom: '0.8em',
        lineHeight: '1.4'
      },
      p: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#24292e',
        marginBottom: '1.2em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'justify',
        hyphens: 'auto'
      },
      blockquote: {
        margin: '1.2em 0',
        padding: '0.5em 1em',
        borderLeft: '4px solid #dfe2e5',
        backgroundColor: '#f8f9fa',
        color: '#454d5d',
        fontSize: '16px',
        lineHeight: '1.7',
        fontStyle: 'normal'
      },
      ul: {
        marginBottom: '1.2em',
        paddingLeft: '1.5em',
        color: '#24292e',
        lineHeight: '1.8',
        listStyleType: 'disc'
      },
      ol: {
        marginBottom: '1.2em',
        paddingLeft: '1.5em',
        color: '#24292e',
        lineHeight: '1.8'
      },
      li: {
        marginBottom: '0.4em',
        fontSize: '16px',
        lineHeight: '1.8'
      },
      code: {
        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
        backgroundColor: '#f6f8fa',
        padding: '0.2em 0.4em',
        fontSize: '85%',
        borderRadius: '3px',
        color: '#24292e'
      },
      strong: {
        fontWeight: '600',
        color: '#24292e'
      },
      em: {
        fontStyle: 'italic',
        color: '#24292e'
      },
      a: {
        color: '#0366d6',
        textDecoration: 'none',
        borderBottom: '1px solid #0366d6',
        paddingBottom: '1px'
      }
    }
  },
  {
    id: 'tech',
    name: '科技文档',
    description: '专业的技术文档样式',
    preview: techPreview,
    styles: {
      h1: {
        fontSize: '2.2em',
        color: '#0a192f',
        fontWeight: '700',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        marginBottom: '1em',
        paddingBottom: '0.3em',
        borderBottom: '1px solid #eaecef'
      },
      h2: {
        fontSize: '1.8em',
        color: '#1a365d',
        fontWeight: '600',
        marginTop: '2em',
        marginBottom: '1em',
        paddingBottom: '0.3em',
        borderBottom: '1px solid #eaecef'
      },
      h3: {
        fontSize: '1.4em',
        color: '#2d3748',
        fontWeight: '600',
        marginTop: '1.5em',
        marginBottom: '0.8em'
      },
      p: {
        fontSize: '1em',
        lineHeight: '1.7',
        color: '#2d3748',
        marginBottom: '1em',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      code: {
        backgroundColor: '#f6f8fa',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontSize: '0.9em',
        fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace',
        color: '#476582'
      },
      pre: {
        backgroundColor: '#f6f8fa',
        padding: '1em',
        borderRadius: '6px',
        overflow: 'auto',
        fontSize: '0.9em',
        lineHeight: '1.5',
        border: '1px solid #eaecef'
      },
      blockquote: {
        borderLeft: '4px solid #4299e1',
        marginLeft: '0',
        paddingLeft: '1em',
        color: '#4a5568',
        backgroundColor: '#ebf8ff'
      },
      ul: {
        paddingLeft: '2em',
        marginBottom: '1em',
        lineHeight: '1.7',
        color: '#2d3748'
      },
      ol: {
        paddingLeft: '2em',
        marginBottom: '1em',
        lineHeight: '1.7',
        color: '#2d3748'
      },
      li: {
        marginBottom: '0.5em'
      },
      strong: {
        fontWeight: '600',
        color: '#1a365d'
      },
      em: {
        color: '#2d3748',
        fontStyle: 'italic'
      }
    }
  },
  {
    id: 'blog',
    name: '博客风格',
    description: '轻松活泼的博客样式',
    preview: blogPreview,
    styles: {
      h1: {
        fontSize: '2.6em',
        color: '#ff6b6b',
        fontWeight: '700',
        marginBottom: '1em',
        textAlign: 'center',
        lineHeight: '1.2',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      },
      h2: {
        fontSize: '2em',
        color: '#20c997',
        fontWeight: '600',
        marginTop: '1.8em',
        marginBottom: '0.8em',
        lineHeight: '1.3'
      },
      h3: {
        fontSize: '1.5em',
        color: '#339af0',
        fontWeight: '600',
        marginTop: '1.5em',
        marginBottom: '0.6em'
      },
      p: {
        fontSize: '1.1em',
        lineHeight: '1.8',
        color: '#495057',
        marginBottom: '1.2em',
        letterSpacing: '0.01em'
      },
      blockquote: {
        borderLeft: '4px solid #ffd43b',
        backgroundColor: '#fff9db',
        padding: '1em 1.2em',
        marginBottom: '1.5em',
        borderRadius: '0 4px 4px 0',
        color: '#666'
      },
      ul: {
        marginLeft: '1.5em',
        marginBottom: '1.5em',
        color: '#495057',
        lineHeight: '1.7'
      },
      ol: {
        marginLeft: '1.5em',
        marginBottom: '1.5em',
        color: '#495057',
        lineHeight: '1.7'
      },
      li: {
        marginBottom: '0.5em',
        fontSize: '1.1em'
      },
      code: {
        backgroundColor: '#f8f9fa',
        color: '#e64980',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontSize: '0.9em',
        fontFamily: 'Consolas, monospace'
      },
      strong: {
        fontWeight: '700',
        color: '#ff6b6b'
      },
      em: {
        fontStyle: 'italic',
        color: '#20c997'
      }
    }
  },
  {
    id: 'minimal',
    name: '极简设计',
    description: '专注内容的极简风格',
    preview: minimalPreview,
    styles: {
      h1: {
        fontSize: '2.4em',
        color: '#000',
        fontWeight: '800',
        marginBottom: '1.5em',
        letterSpacing: '-0.03em',
        lineHeight: '1.2'
      },
      h2: {
        fontSize: '1.8em',
        color: '#222',
        fontWeight: '700',
        marginTop: '2em',
        marginBottom: '1em',
        letterSpacing: '-0.02em'
      },
      h3: {
        fontSize: '1.4em',
        color: '#333',
        fontWeight: '600',
        marginTop: '1.5em',
        marginBottom: '0.8em'
      },
      p: {
        fontSize: '1.1em',
        lineHeight: '1.8',
        color: '#444',
        marginBottom: '1.5em',
        letterSpacing: '0.01em'
      },
      blockquote: {
        borderLeft: '2px solid #000',
        paddingLeft: '1.5em',
        marginLeft: '0',
        marginRight: '0',
        marginBottom: '1.5em',
        fontStyle: 'italic',
        color: '#666'
      },
      ul: {
        marginLeft: '1.2em',
        marginBottom: '1.5em',
        color: '#444',
        lineHeight: '1.8'
      },
      ol: {
        marginLeft: '1.2em',
        marginBottom: '1.5em',
        color: '#444',
        lineHeight: '1.8'
      },
      li: {
        marginBottom: '0.5em',
        fontSize: '1.1em'
      },
      code: {
        backgroundColor: '#f5f5f5',
        padding: '0.2em 0.4em',
        borderRadius: '2px',
        fontSize: '0.9em',
        color: '#333',
        fontFamily: 'monospace'
      },
      strong: {
        fontWeight: '700',
        color: '#000'
      },
      em: {
        fontStyle: 'italic',
        color: '#666'
      }
    }
  }
]