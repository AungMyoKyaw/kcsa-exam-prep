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
        <div
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
              {mutatingControllers.map((ctrl) => (
                <div
                  key={ctrl}
                  className="rounded-lg px-3 py-2 text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                  }}
                >
                  {ctrl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div
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
        </div>

        {/* Validating Lane */}
        <div
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
              {validatingControllers.map((ctrl) => (
                <div
                  key={ctrl}
                  className="rounded-lg px-3 py-2 text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--accent-sage)',
                    color: 'var(--accent-sage)',
                  }}
                >
                  {ctrl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow to etcd */}
        <div
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
        </div>

        {/* etcd */}
        <div
          className="rounded-xl px-6 py-3 text-center font-semibold text-sm shadow-sm"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '2px solid var(--border-medium)',
            color: 'var(--text-primary)',
          }}
        >
          etcd <span className="font-normal" style={{ color: 'var(--text-secondary)' }}>(persist)</span>
        </div>
      </div>

      <div className="mt-6 text-center text-xs max-w-lg mx-auto" style={{ color: 'var(--text-tertiary)' }}>
        <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Key exam point: </span>
        Mutating controllers can CHANGE your request. Validating controllers only APPROVE or REJECT — they never modify.
      </div>
    </div>
  )
}
