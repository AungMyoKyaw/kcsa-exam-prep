import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, Check } from 'lucide-react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('yml', yaml)
SyntaxHighlighter.registerLanguage('sh', bash)
SyntaxHighlighter.registerLanguage('shell', bash)

const lightCustomStyle = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: 0,
    overflow: 'visible',
  },
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
}

const darkCustomStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: 0,
    overflow: 'visible',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
}

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export default function CodeBlock({ code, language = 'yaml', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  const checkDarkMode = useCallback(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Watch for theme changes
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const displayLang = language === 'yml' ? 'yaml' : language === 'sh' || language === 'shell' ? 'bash' : language

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="my-6 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-code)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-[0.06em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {displayLang}
          </span>
          {filename && (
            <>
              <span style={{ color: 'var(--border-medium)' }}>|</span>
              <span
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {filename}
              </span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200"
          style={{
            color: copied ? 'var(--success)' : 'var(--text-secondary)',
            backgroundColor: copied
              ? 'rgba(10, 123, 62, 0.1)'
              : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-elevated)'
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }
          }}
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <div className="p-5 overflow-x-auto">
        <SyntaxHighlighter
          language={displayLang}
          style={isDark ? darkCustomStyle : lightCustomStyle}
          wrapLines
          showLineNumbers={false}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}
