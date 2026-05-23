import { motion } from 'framer-motion';

interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface ComparisonTableProps {
  columns: TableColumn[];
  rows: Record<string, string>[];
  highlightRow?: (row: Record<string, string>) => string | null;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ComparisonTable({ columns, rows, highlightRow }: ComparisonTableProps) {
  const getHighlightColor = (row: Record<string, string>) => {
    if (!highlightRow) return null;
    return highlightRow(row);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="my-6 overflow-x-auto rounded-xl"
      style={{
        border: '1px solid var(--border-subtle)',
      }}
    >
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--accent-primary)',
              opacity: 0.1,
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: 'var(--text-primary)',
                  width: col.width,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const highlightColor = getHighlightColor(row);
            return (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: easeOutExpo }}
                style={{
                  borderBottom:
                    idx < rows.length - 1
                      ? '1px solid var(--border-subtle)'
                      : 'none',
                  backgroundColor: highlightColor || 'transparent',
                }}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="px-4 py-3"
                    style={{
                      color: colIdx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: colIdx === 0 ? 600 : 400,
                      borderLeft:
                        colIdx > 0 && colIdx === 1
                          ? '2px solid var(--accent-amber)'
                          : colIdx > 0 && colIdx === 2
                          ? '2px solid var(--accent-sage)'
                          : 'none',
                      backgroundColor:
                        row[col.key] === 'Forbidden'
                          ? 'rgba(232, 122, 93, 0.05)'
                          : row[col.key] === 'Required' || row[col.key]?.includes('MUST')
                          ? 'rgba(163, 196, 168, 0.05)'
                          : 'transparent',
                    }}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
