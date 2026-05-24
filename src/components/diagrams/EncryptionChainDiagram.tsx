interface EncryptionChainDiagramProps {
  className?: string
}

export default function EncryptionChainDiagram({ className }: EncryptionChainDiagramProps) {
  const layers = [
    {
      label: 'Pod Secret',
      sublabel: 'plaintext in memory',
      color: 'var(--text-primary)',
      bgColor: 'var(--surface-elevated)',
      width: 220,
    },
    {
      label: 'base64',
      sublabel: 'NOT encryption!',
      color: 'var(--accent-coral)',
      bgColor: 'rgba(207, 34, 46, 0.08)',
      width: 180,
      warning: true,
    },
    {
      label: 'DEK',
      sublabel: 'Data Encryption Key — per resource',
      color: 'var(--accent-primary)',
      bgColor: 'rgba(9, 105, 218, 0.08)',
      width: 260,
    },
    {
      label: 'KEK',
      sublabel: 'Key Encryption Key — in KMS',
      color: 'var(--accent-lavender)',
      bgColor: 'rgba(130, 87, 229, 0.08)',
      width: 240,
      highlight: true,
    },
    {
      label: 'Root Key',
      sublabel: 'in HSM',
      color: 'var(--accent-sage)',
      bgColor: 'rgba(26, 127, 55, 0.08)',
      width: 140,
    },
  ]

  return (
    <div className={`my-8 w-full flex flex-col items-center ${className ?? ''}`}>
      <div className="flex flex-col items-center gap-3">
        {layers.map((layer, idx) => (
          <div key={layer.label} className="flex flex-col items-center">
            {idx > 0 && (
              <div
                className="flex items-center overflow-hidden"
                style={{ height: '24px' }}
              >
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <path
                    d="M10 0v20m0 0l-7-7m7 7l7-7"
                    stroke="var(--border-medium)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div
              className="relative flex flex-col items-center justify-center rounded-xl py-3 px-4 shadow-sm text-center"
              style={{
                width: `${layer.width}px`,
                maxWidth: '90vw',
                backgroundColor: layer.bgColor,
                border: `2px solid ${layer.color}`,
              }}
            >
              <span className="text-sm font-bold" style={{ color: layer.color }}>
                {layer.label}
              </span>
              <span className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {layer.sublabel}
              </span>

              {layer.warning && (
                <div
                  className="absolute -right-3 -top-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: 'var(--accent-coral)' }}
                >
                  ✕
                </div>
              )}

              {layer.highlight && (
                <div
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: 'var(--accent-sage)',
                      color: '#ffffff',
                    }}
                  >
                    KMS v2 RECOMMENDED
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-xs max-w-md" style={{ color: 'var(--text-tertiary)' }}>
        <span className="font-semibold" style={{ color: 'var(--accent-coral)' }}>⚠ base64 is NOT encryption — </span>
        it is just encoding. Anyone can decode it. The actual encryption happens at the DEK/KEK layer.
      </div>
    </div>
  )
}
