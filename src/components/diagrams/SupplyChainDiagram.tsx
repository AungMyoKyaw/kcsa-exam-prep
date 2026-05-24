import { GitBranch, Hammer, Package, ShieldCheck, Server, AlertTriangle } from 'lucide-react'

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
            <div
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
            </div>

            {/* Arrow */}
            {idx < arrows.length && (
              <div className="flex flex-col items-center py-2 w-full max-w-sm">
                <div className="flex items-center gap-2">
                  {arrows[idx].attackPoint && (
                    <AlertTriangle size={14} style={{ color: 'var(--accent-coral)', flexShrink: 0 }} />
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
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="mt-1.5">
                  <path
                    d="M12 0v24m0 0l-7-7m7 7l7-7"
                    stroke="var(--border-medium)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-4 text-center text-xs max-w-lg mx-auto"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>
          🔺 Attack points
        </span>{' '}
        exist at every stage — provenance, SBOM, signing, and admission verification each close a gap.
      </div>
    </div>
  )
}
