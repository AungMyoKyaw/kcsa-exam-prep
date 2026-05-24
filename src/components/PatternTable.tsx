import { Table2, Lightbulb } from 'lucide-react';

interface PatternRow {
  label: string;
  values: (string | React.ReactNode)[];
  highlight?: boolean;
}

interface PatternTableProps {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: PatternRow[];
  tip?: string;
}

export default function PatternTable({ title, subtitle, headers, rows, tip }: PatternTableProps) {
  return (
    <div
      className="rounded-xl overflow-hidden my-6"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--accent-amber)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(242,196,77,0.1)' }}
        >
          <Table2 size={14} style={{ color: 'var(--accent-amber)' }} />
        </div>
        <div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderLeft: i === 0 ? '1px solid var(--border-subtle)' : 'none',
                    borderRight: '1px solid var(--border-subtle)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td
                  className="px-4 py-2.5 font-medium"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    borderLeft: '1px solid var(--border-subtle)',
                    color: row.highlight ? 'var(--accent-primary)' : 'var(--text-primary)',
                    backgroundColor: row.highlight ? 'rgba(4,80,54,0.04)' : 'transparent',
                  }}
                >
                  {row.label}
                </td>
                {row.values.map((v, vi) => (
                  <td
                    key={vi}
                    className="px-4 py-2.5"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      borderRight: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      backgroundColor: row.highlight ? 'rgba(4,80,54,0.04)' : 'transparent',
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tip && (
        <div
          className="px-5 py-3 flex items-start gap-2"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(242,196,77,0.04)',
          }}
        >
          <Lightbulb size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-amber)' }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {tip}
          </p>
        </div>
      )}
    </div>
  );
}
