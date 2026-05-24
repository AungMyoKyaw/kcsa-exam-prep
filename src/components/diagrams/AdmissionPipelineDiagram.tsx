import { motion } from 'framer-motion'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface AdmissionPipelineDiagramProps {
  className?: string
}

export default function AdmissionPipelineDiagram({ className }: AdmissionPipelineDiagramProps) {
  const mutatingControllers = ['LimitRanger', 'ServiceAccount', 'PodPreset (if enabled)']
  const validatingControllers = ['NodeRestriction', 'ResourceQuota', 'PodSecurity']

  return (
    <div className={`my-8 w-full ${className ?? ''}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Mutating Lane */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="w-full max-w-xl"
        >
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'rgba(154, 103, 0, 0.08)',
              border: '1.5px solid var(--accent-amber)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--accent-amber)',
                  color: '#ffffff',
                }}
              >
                Mutating
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Runs FIRST — can MODIFY your request
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mutatingControllers.map((ctrl, idx) => (
                <motion.div
                  key={ctrl}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.15 + idx * 0.08 }}
                  className="rounded-lg px-3 py-2 text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                  }}
                >
                  {ctrl}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow down */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
            <path
              d="M12 0v28m0 0l-8-8m8 8l8-8"
              stroke="var(--border-medium)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs font-medium mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Mutating runs BEFORE Validating
          </span>
        </motion.div>

        {/* Validating Lane */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.3 }}
          className="w-full max-w-xl"
        >
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'rgba(26, 127, 55, 0.08)',
              border: '1.5px solid var(--accent-sage)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--accent-sage)',
                  color: '#ffffff',
                }}
              >
                Validating
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Runs AFTER mutating — only APPROVES or REJECTS
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {validatingControllers.map((ctrl, idx) => (
                <motion.div
                  key={ctrl}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.5 + idx * 0.08 }}
                  className="rounded-lg px-3 py-2 text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--accent-sage)',
                    color: 'var(--accent-sage)',
                  }}
                >
                  {ctrl}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow to etcd */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="flex flex-col items-center"
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
            <path
              d="M12 0v28m0 0l-8-8m8 8l8-8"
              stroke="var(--border-medium)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* etcd */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 1.0 }}
          className="rounded-xl px-6 py-3 text-center font-semibold text-sm shadow-sm"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '2px solid var(--border-medium)',
            color: 'var(--text-primary)',
          }}
        >
          etcd <span className="font-normal" style={{ color: 'var(--text-secondary)' }}>(persist)</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-6 text-center text-xs max-w-lg mx-auto"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Key exam point: </span>
        Mutating controllers can CHANGE your request. Validating controllers only APPROVE or REJECT — they never modify.
      </motion.div>
    </div>
  )
}
