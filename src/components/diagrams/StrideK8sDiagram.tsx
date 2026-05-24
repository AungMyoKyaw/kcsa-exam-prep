import { motion } from 'framer-motion'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface StrideK8sDiagramProps {
  className?: string
}

interface ThreatSegment {
  letter: string
  threat: string
  k8sExample: string
  color: string
  angle: number
}

export default function StrideK8sDiagram({ className }: StrideK8sDiagramProps) {
  const segments: ThreatSegment[] = [
    {
      letter: 'S',
      threat: 'Spoofing',
      k8sExample: 'Stolen SA token',
      color: '#9B87F5',
      angle: 0,
    },
    {
      letter: 'T',
      threat: 'Tampering',
      k8sExample: 'etcd direct access',
      color: '#E87A5D',
      angle: 60,
    },
    {
      letter: 'R',
      threat: 'Repudiation',
      k8sExample: 'Missing audit logs',
      color: '#F2C44D',
      angle: 120,
    },
    {
      letter: 'I',
      threat: 'Info Disclosure',
      k8sExample: 'Unencrypted secrets',
      color: '#1A5FB4',
      angle: 180,
    },
    {
      letter: 'D',
      threat: 'DoS',
      k8sExample: 'Resource exhaustion',
      color: '#B38600',
      angle: 240,
    },
    {
      letter: 'E',
      threat: 'Elevation',
      k8sExample: 'Privileged container',
      color: '#D42B1E',
      angle: 300,
    },
  ]

  const cx = 200
  const cy = 200
  const outerR = 170
  const innerR = 90
  const centerR = 70

  const polar = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const segmentPath = (startAngle: number, endAngle: number) => {
    const startOuter = polar(startAngle, outerR)
    const endOuter = polar(endAngle, outerR)
    const startInner = polar(startAngle, innerR)
    const endInner = polar(endAngle, innerR)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return [
      `M ${startOuter.x},${startOuter.y}`,
      `A ${outerR},${outerR} 0 ${largeArc},1 ${endOuter.x},${endOuter.y}`,
      `L ${endInner.x},${endInner.y}`,
      `A ${innerR},${innerR} 0 ${largeArc},0 ${startInner.x},${startInner.y}`,
      'Z',
    ].join(' ')
  }

  return (
    <div className={`my-8 flex flex-col items-center ${className ?? ''}`}>
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
        className="w-full max-w-[500px]"
      >
        <svg viewBox="0 0 400 400" className="w-full">
          {/* Outer decorative ring */}
          <circle
            cx={cx}
            cy={cy}
            r={outerR + 8}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1"
            strokeDasharray="4,6"
            opacity="0.5"
          />

          {/* Segments */}
          {segments.map((seg, idx) => {
            const startAngle = seg.angle - 28
            const endAngle = seg.angle + 28
            const midAngle = seg.angle
            const midOuter = polar(midAngle, outerR - 25)
            const midInner = polar(midAngle, innerR + 25)

            return (
              <motion.g
                key={seg.letter}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: idx * 0.1 }}
              >
                <path
                  d={segmentPath(startAngle, endAngle)}
                  fill={seg.color}
                  opacity="0.12"
                  stroke={seg.color}
                  strokeWidth="2"
                  style={{ transition: 'opacity 0.3s ease' }}
                />
                {/* Letter */}
                <text
                  x={midOuter.x}
                  y={midOuter.y + 4}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill={seg.color}
                  fontFamily="var(--font-display)"
                >
                  {seg.letter}
                </text>
                {/* Threat label */}
                <text
                  x={midInner.x}
                  y={midInner.y - 3}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--text-primary)"
                  fontFamily="var(--font-body)"
                >
                  {seg.threat}
                </text>
                {/* K8s example */}
                <text
                  x={midInner.x}
                  y={midInner.y + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--text-secondary)"
                  fontFamily="var(--font-body)"
                >
                  {seg.k8sExample}
                </text>
              </motion.g>
            )
          })}

          {/* Center circle */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.6 }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={centerR}
              fill="var(--surface-base)"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="var(--accent-primary)"
              fontFamily="var(--font-display)"
            >
              STRIDE
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--text-secondary)"
              fontFamily="var(--font-body)"
            >
              → Kubernetes
            </text>
          </motion.g>

          {/* Connection arrows between segments */}
          {segments.map((seg, idx) => {
            const next = segments[(idx + 1) % segments.length]
            const p1 = polar(seg.angle + 28, (outerR + innerR) / 2)
            const p2 = polar(next.angle - 28, (outerR + innerR) / 2)
            return (
              <motion.path
                key={`arrow-${seg.letter}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 + idx * 0.05 }}
                d={`M ${p1.x},${p1.y} A ${(outerR + innerR) / 2},${(outerR + innerR) / 2} 0 0,1 ${p2.x},${p2.y}`}
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )
          })}
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="mt-2 text-center text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        STRIDE threat model mapped to Kubernetes — circular flow back to Spoofing
      </motion.div>
    </div>
  )
}
