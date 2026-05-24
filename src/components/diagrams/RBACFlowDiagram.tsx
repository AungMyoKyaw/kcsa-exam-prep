import type { ReactNode } from 'react'

interface FlowStepProps {
  label: string
  sublabel?: string
  color: string
  highlight?: boolean
  index: number
  children?: ReactNode
}

function FlowStep({ label, sublabel, color, highlight, children }: FlowStepProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="rounded-xl px-4 py-3 text-center font-semibold text-sm min-w-[100px] shadow-sm"
        style={{
          backgroundColor: highlight ? `${color}20` : 'var(--surface-elevated)',
          border: `2px solid ${highlight ? color : 'var(--border-subtle)'}`,
          color: highlight ? color : 'var(--text-primary)',
        }}
      >
        {label}
        {sublabel && (
          <div className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {sublabel}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex items-center mx-1">
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="flex-shrink-0">
        <path
          d="M0 8h28m0 0l-6-5m6 5l-6 5"
          stroke="var(--border-medium)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

interface RBACFlowDiagramProps {
  className?: string
}

export default function RBACFlowDiagram({ className }: RBACFlowDiagramProps) {
  const steps = [
    { label: 'kubectl', sublabel: 'User/Client', color: 'var(--accent-primary)', highlight: false },
    { label: 'AuthN', sublabel: 'Who?', color: 'var(--accent-lavender)', highlight: false },
    { label: 'AuthZ / RBAC', sublabel: 'What?', color: 'var(--accent-sage)', highlight: true },
    { label: 'Admission', sublabel: 'Should we?', color: 'var(--accent-amber)', highlight: false },
    { label: 'Validation', sublabel: 'Valid?', color: 'var(--accent-primary)', highlight: false },
    { label: 'etcd', sublabel: 'Persist', color: 'var(--accent-coral)', highlight: false },
  ]

  const dangerousVerbs = ['bind', 'escalate', 'impersonate']

  return (
    <div className={`my-8 w-full ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-center gap-y-4">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex items-center">
            <FlowStep
              label={step.label}
              sublabel={step.sublabel}
              color={step.color}
              highlight={step.highlight}
              index={idx}
            >
              {step.label === 'AuthZ / RBAC' && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap shadow-sm"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1.5px solid var(--accent-coral)',
                      color: 'var(--accent-coral)',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>Dangerous verbs: </span>
                    {dangerousVerbs.map((v, i) => (
                      <span key={v}>
                        <span className="font-bold">{v}</span>
                        {i < dangerousVerbs.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </FlowStep>
            {idx < steps.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Request authorization flow — AuthZ/RBAC is the most exam-relevant step
      </div>
    </div>
  )
}
