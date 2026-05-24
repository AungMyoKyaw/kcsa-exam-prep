import { motion } from 'framer-motion'
import { GitBranch, Hammer, Package, ShieldCheck, Server, AlertTriangle } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface SupplyChainDiagramProps {
  className?: string
}

interface Stage {
  icon: React.ReactNode
  label: string
  color: string
}

interface ArrowData {
  control: string
  attackPoint?: boolean
}

export default function SupplyChainDiagram({ className }: SupplyChainDiagramProps) {
  const stages: Stage[] = [
    {
      icon: <GitBranch size={20} strokeWidth={2} />,
      label: 'Source',
      color: 'var(--accent-primary)',
    },
    {
      icon: <Hammer size={20} strokeWidth={2} />,
      label: 'Build',
      color: 'var(--accent-amber)',
    },
    {
      icon: <Package size={20} strokeWidth={2} />,
      label: 'Package',
      color: 'var(--accent-lavender)',
    },
    {
      icon: <ShieldCheck size={20} strokeWidth={2} />,
      label: 'Deploy',
      color: 'var(--accent-sage)',
    },
    {
      icon: <Server size={20} strokeWidth={2} />,
      label: 'Runtime',
      color: 'var(--text-primary)',
    },
  ]

  const arrows: ArrowData[] = [
    { control: 'SLSA provenance', attackPoint: true },
    { control: 'SBOM generated', attackPoint: true },
    { control: 'Cosign sign', attackPoint: true },
    { control: 'Admission verify', attackPoint: false },
  ]

  return (
    <div className={`my-8 w-full ${className ?? ''}`}>
      <div className="flex flex-col items-center max-w-xl mx-auto">
        {stages.map((stage, idx) => (
          <div key={stage.label} className="flex flex-col items-center w-full">
            {/* Stage Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: idx * 0.15 }}
              className="flex items-center gap-3 rounded-xl px-5 py-3 shadow-sm w-full max-w-sm"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: `2px solid ${stage.color}`,
              }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
              >
                {stage.icon}
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: stage.color }}>
                  {stage.label}
                </span>
                <span className="block text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {stage.label === 'Source' && 'Git repo'}
                  {stage.label === 'Build' && 'CI/CD pipeline'}
                  {stage.label === 'Package' && 'OCI Registry'}
                  {stage.label === 'Deploy' && 'Admission check'}
                  {stage.label === 'Runtime' && 'Production cluster'}
                </span>
              </div>
            </motion.div>

            {/* Arrow */}
            {idx < arrows.length && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 'auto' }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: easeOutExpo, delay: 0.25 + idx * 0.15 }}
                className="flex flex-col items-center py-2"
              >
                <div className="relative flex items-center gap-2">
                  {arrows[idx].attackPoint && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.6 + idx * 0.2 }}
                      className="absolute -left-7 top-1/2 -translate-y-1/2 flex items-center justify-center"
                    >
                      <AlertTriangle size={14} style={{ color: 'var(--accent-coral)' }} />
                    </motion.div>
                  )}
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: arrows[idx].attackPoint
                        ? 'rgba(207, 34, 46, 0.08)'
                        : 'var(--surface-base)',
                      color: arrows[idx].attackPoint
                        ? 'var(--accent-coral)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${arrows[idx].attackPoint ? 'var(--accent-coral)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {arrows[idx].control}
                  </span>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-1">
                  <path
                    d="M10 0v16m0 0l-6-6m6 6l6-6"
                    stroke="var(--border-medium)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-4 text-center text-xs max-w-lg mx-auto"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>
          🔺 Attack points
        </span>{' '}
        exist at every stage — provenance, SBOM, signing, and admission verification each close a gap.
      </motion.div>
    </div>
  )
}
