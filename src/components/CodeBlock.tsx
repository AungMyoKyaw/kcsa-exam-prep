import { useState } from 'react';
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
    <div
      className="my-6 rounded-lg overflow-hidden"
      style={{
        backgroundColor: isDark ? '#161b22' : '#f6f8fa',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          backgroundColor: isDark ? '#0d1117' : '#eaeef2',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            {language}
          </span>
          {filename != null && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={() => { void handleCopy(); }}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
          style={{
            color: copied ? 'var(--accent-sage)' : 'var(--text-secondary)',
            backgroundColor: copied ? 'rgba(63, 185, 80, 0.1)' : 'transparent',
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
            color: isDark ? '#656d76' : '#848d97',
            paddingRight: 16,
            minWidth: 36,
          }}
          customStyle={{
            margin: 0,
            padding: '20px 24px',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            fontFamily: 'var(--font-mono)',
            borderRadius: 0,
          }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
