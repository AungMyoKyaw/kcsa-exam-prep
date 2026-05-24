import { useState } from 'react';
import { motion } from 'framer-motion';

interface StrideHex {
  letter: string;
  label: string;
  k8sExample: string;
  color: string;
  x: number;
  y: number;
}

const hexagons: StrideHex[] = [
  {
    letter: 'S', label: 'Spoofing', k8sExample: 'Stolen SA token, compromised client cert',
    color: '#9B87F5', x: 200, y: 60,
  },
  {
    letter: 'T', label: 'Tampering', k8sExample: 'Modifying etcd data, mutating container images',
    color: '#E87A5D', x: 300, y: 120,
  },
  {
    letter: 'R', label: 'Repudiation', k8sExample: 'No audit logging, missing request attribution',
    color: '#F2C44D', x: 300, y: 240,
  },
  {
    letter: 'I', label: 'Information\nDisclosure', k8sExample: 'Reading secrets without RBAC, unencrypted traffic',
    color: '#1A5FB4', x: 200, y: 300,
  },
  {
    letter: 'D', label: 'Denial of\nService', k8sExample: 'Resource exhaustion, etcd flooding',
    color: '#B38600', x: 100, y: 240,
  },
  {
    letter: 'E', label: 'Elevation of\nPrivilege', k8sExample: 'RBAC abuse, privileged container escape',
    color: '#D42B1E', x: 100, y: 120,
  },
];

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface StrideDiagramProps {
  onHover?: (letter: string | null) => void;
}

export default function StrideDiagram({ onHover }: StrideDiagramProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const hexPath = (cx: number, cy: number, r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      className="my-8 flex flex-col items-center"
    >
      <svg viewBox="0 0 400 400" className="w-full max-w-[500px]">
        {/* Center cluster icon */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        >
          <circle cx="200" cy="180" r="30" fill="var(--accent-primary)" opacity="0.15" />
          <text
            x="200" y="175"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="var(--accent-primary)"
            fontFamily="var(--font-body)"
          >
            Kubernetes
          </text>
          <text
            x="200" y="187"
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-secondary)"
            fontFamily="var(--font-body)"
          >
            Cluster
          </text>
        </motion.g>

        {/* Connection lines */}
        {hexagons.map((h) => (
          <line
            key={`line-${h.letter}`}
            x1="200" y1="180"
            x2={h.x} y2={h.y}
            stroke={h.color}
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="4,4"
          />
        ))}

        {/* Hexagons */}
        {hexagons.map((h, idx) => {
          const isHovered = hovered === h.letter;
          return (
            <motion.g
              key={h.letter}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.1 + idx * 0.1 }}
              onMouseEnter={() => {
                setHovered(h.letter);
                onHover?.(h.letter);
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={hexPath(h.x, h.y, isHovered ? 52 : 48)}
                fill={h.color}
                opacity={isHovered ? 0.2 : 0.1}
                stroke={h.color}
                strokeWidth={isHovered ? 2.5 : 1.5}
                style={{ transition: 'all 0.3s ease' }}
              />
              <text
                x={h.x}
                y={h.y - 8}
                textAnchor="middle"
                fontSize="22"
                fontWeight="700"
                fill={h.color}
                fontFamily="var(--font-display)"
              >
                {h.letter}
              </text>
              <text
                x={h.x}
                y={h.y + 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={isHovered ? h.color : 'var(--text-secondary)'}
                fontFamily="var(--font-body)"
              >
                {h.label.split('\n')[0]}
              </text>
              {h.label.includes('\n') && (
                <text
                  x={h.x}
                  y={h.y + 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill={isHovered ? h.color : 'var(--text-secondary)'}
                  fontFamily="var(--font-body)"
                >
                  {h.label.split('\n')[1]}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered != null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="text-center px-4 py-2 rounded-lg max-w-md mx-auto"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {hexagons.find(h => h.letter === hovered)?.k8sExample}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
