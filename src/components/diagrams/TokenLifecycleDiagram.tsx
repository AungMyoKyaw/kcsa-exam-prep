import { motion } from 'framer-motion'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface TokenLifecycleDiagramProps {
  className?: string
}

export default function TokenLifecycleDiagram({ className }: TokenLifecycleDiagramProps) {
  const legacySteps = [
    { label: 'Long-lived Secret', icon: '🔑' },
    { label: 'Mounted as volume', icon: '📂' },
    { label: 'Never expires', icon: '⏳' },
    { label: 'HIGH RISK', icon: '⚠️' },
  ]

  const boundSteps = [
    { label: 'TokenRequest API', icon: '🔐' },
    { label: 'Projected volume', icon: '📂' },
    { label: 'Auto-rotates (1hr)', icon: '♻️' },
    { label: 'SHORT-LIVED', icon: '✅' },
  ]

  return (
    <div className={`my-8 w-full ${className ?? ''}`}>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto">
        {/* Legacy Token Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="flex-1 rounded-xl p-4"
          style={{
            backgroundColor: 'rgba(207, 34, 46, 0.06)',
            border: '1.5px solid var(--accent-coral)',
          }}
        >
          <div className="text-center mb-4">
            <span
              className="text-sm font-bold px-3 py-1 rounded-lg inline-block"
              style={{
                backgroundColor: 'var(--accent-coral)',
                color: '#ffffff',
              }}
            >
              Legacy Token
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {legacySteps.map((step, idx) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.15 + idx * 0.1 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--surface-base)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="text-lg">{step.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: idx === legacySteps.length - 1 ? 'var(--accent-coral)' : 'var(--text-primary)',
                  }}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* VS Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div
            className="rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold shadow-sm"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '2px solid var(--border-medium)',
              color: 'var(--text-secondary)',
            }}
          >
            VS
          </div>
        </motion.div>

        {/* Bound Token Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
          className="flex-1 rounded-xl p-4"
          style={{
            backgroundColor: 'rgba(26, 127, 55, 0.06)',
            border: '1.5px solid var(--accent-sage)',
          }}
        >
          <div className="text-center mb-4">
            <span
              className="text-sm font-bold px-3 py-1 rounded-lg inline-block"
              style={{
                backgroundColor: 'var(--accent-sage)',
                color: '#ffffff',
              }}
            >
              Bound Token
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {boundSteps.map((step, idx) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.35 + idx * 0.1 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--surface-base)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="text-lg">{step.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: idx === boundSteps.length - 1 ? 'var(--accent-sage)' : 'var(--text-primary)',
                  }}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Rotation Timeline Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-6 flex flex-col items-center"
      >
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Bound token auto-rotation timeline
        </div>
        <div className="flex items-center gap-1 max-w-sm w-full">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1.0 + i * 0.08 }}
              className="flex-1 rounded-sm origin-bottom"
              style={{
                height: `${16 + Math.sin(i * 1.2) * 10}px`,
                backgroundColor: i % 2 === 0 ? 'var(--accent-sage)' : 'var(--accent-primary)',
                opacity: 0.6 + i * 0.07,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between w-full max-w-sm mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>0h</span>
          <span>1h (rotation)</span>
          <span>2h</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-5 text-center"
      >
        <span
          className="text-xs font-bold px-3 py-1 rounded-md inline-block"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
          }}
        >
          Since Kubernetes 1.24 — Legacy tokens are deprecated
        </span>
      </motion.div>
    </div>
  )
}
