import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Info,
  AlertTriangle,
  Lightbulb,
  Star,
} from 'lucide-react'

type CalloutVariant = 'info' | 'warning' | 'tip' | 'exam-focus'

interface CalloutBoxProps {
  variant: CalloutVariant
  title?: string
  children: React.ReactNode
}

const variantConfig = {
  info: {
    icon: Info,
    lightBorder: '#1A5FB4',
    lightBg: 'rgba(26, 95, 180, 0.06)',
    darkBorder: '#78B9FF',
    darkBg: 'rgba(120, 185, 255, 0.08)',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    lightBorder: '#B38600',
    lightBg: 'rgba(179, 134, 0, 0.06)',
    darkBorder: '#FFD166',
    darkBg: 'rgba(255, 209, 102, 0.08)',
    label: 'Warning',
  },
  tip: {
    icon: Lightbulb,
    lightBorder: '#0A7B3E',
    lightBg: 'rgba(10, 123, 62, 0.06)',
    darkBorder: '#3DD9A0',
    darkBg: 'rgba(61, 217, 160, 0.08)',
    label: 'Tip',
  },
  'exam-focus': {
    icon: Star,
    lightBorder: '#D42B1E',
    lightBg: 'rgba(212, 43, 30, 0.06)',
    darkBorder: '#FF8A6B',
    darkBg: 'rgba(255, 138, 107, 0.08)',
    label: 'Exam Focus',
  },
}

export default function CalloutBox({ variant, title, children }: CalloutBoxProps) {
  const [isDark, setIsDark] = useState(false)

  // Check dark mode
  if (typeof window !== 'undefined') {
    const checkDark = () => {
      const theme = document.documentElement.classList.contains('dark')
      setIsDark(theme)
    }
    // Initial check
    if (!isDark && document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    } else if (isDark && !document.documentElement.classList.contains('dark')) {
      setIsDark(false)
    }
    // Listen for changes
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }

  const config = variantConfig[variant]
  const Icon = config.icon
  const borderColor = isDark ? config.darkBorder : config.lightBorder
  const bgColor = isDark ? config.darkBg : config.lightBg

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="my-6 rounded-xl overflow-hidden"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} style={{ color: borderColor }} />
          <span
            className="text-sm font-semibold"
            style={{ color: borderColor, fontFamily: 'var(--font-body)' }}
          >
            {title || config.label}
          </span>
        </div>
        <div
          className="text-base leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}
