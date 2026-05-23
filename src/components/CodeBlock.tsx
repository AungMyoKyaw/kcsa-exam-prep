import { useState } from 'react';
import { motion } from 'framer-motion';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import { Clipboard, Check } from 'lucide-react';

SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('shell', bash);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  isDark?: boolean;
}

export default function CodeBlock({
  code,
  language = 'yaml',
  filename,
  showLineNumbers = true,
  isDark = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const style = isDark ? oneDark : oneLight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="my-6 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#182520' : '#F0F1EC',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          backgroundColor: isDark ? '#141F1B' : '#E8E9E3',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {language}
          </span>
          {filename && (
            <span
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all duration-200"
          style={{
            color: copied ? 'var(--accent-sage)' : 'var(--text-secondary)',
            backgroundColor: copied
              ? 'rgba(163, 196, 168, 0.1)'
              : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#1C2A24' : '#F4F5F0';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = copied
              ? 'rgba(163, 196, 168, 0.1)'
              : 'transparent';
          }}
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={style}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            color: isDark ? '#5A6B64' : '#A0A8A0',
            paddingRight: 16,
            minWidth: 36,
          }}
          customStyle={{
            margin: 0,
            padding: '20px 24px',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)',
            borderRadius: 0,
          }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
