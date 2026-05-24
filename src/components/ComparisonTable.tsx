interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface ComparisonTableProps {
  columns?: TableColumn[];
  headers?: string[];
  rows: Record<string, string>[] | string[][];
  highlightRow?: (row: Record<string, string>) => string | null;
}

function normalizeColumns(columns?: TableColumn[], headers?: string[]): TableColumn[] {
  if (columns) return columns;
  if (headers) {
    return headers.map((h, i) => ({ key: `col${i}`, header: h }));
  }
  return [];
}

function normalizeRow(row: Record<string, string> | string[], columns: TableColumn[]): Record<string, string> {
  if (Array.isArray(row)) {
    const obj: Record<string, string> = {};
    columns.forEach((col, i) => {
      obj[col.key] = row[i] ?? '';
    });
    return obj;
  }
  return row;
}

export default function ComparisonTable({ columns, headers, rows, highlightRow }: ComparisonTableProps) {
  const cols = normalizeColumns(columns, headers);

  const getHighlightColor = (row: Record<string, string>) => {
    if (!highlightRow) {return null;}
    return highlightRow(row);
  };

  return (
    <div
      className="my-6 overflow-x-auto rounded-xl"
      style={{
        border: '1px solid var(--border-subtle)',
      }}
    >
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--surface-elevated)',
            }}
          >
            {cols.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: 'var(--text-primary)',
                  width: col.width,
                  borderBottom: '2px solid var(--border-medium)',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rawRow, idx) => {
            const row = normalizeRow(rawRow, cols);
            const highlightColor = getHighlightColor(row);
            const isEven = idx % 2 === 1;
            return (
              <tr
                key={idx}
                style={{
                  borderBottom:
                    idx < rows.length - 1
                      ? '1px solid var(--border-subtle)'
                      : 'none',
                  backgroundColor: highlightColor ?? (isEven ? 'var(--surface-elevated)' : 'transparent'),
                  transition: 'background-color 150ms ease',
                }}
              >
                {cols.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="px-4 py-3"
                    style={(() => {
                      const borderLeft = (() => {
                        if (colIdx > 0 && colIdx === 1) { return '2px solid var(--accent-amber)' }
                        if (colIdx > 0 && colIdx === 2) { return '2px solid var(--accent-sage)' }
                        return 'none'
                      })()
                      const backgroundColor = (() => {
                        if (row[col.key] === 'Forbidden') { return 'rgba(232, 122, 93, 0.05)' }
                        if (row[col.key] === 'Required' || row[col.key]?.includes('MUST')) { return 'rgba(163, 196, 168, 0.05)' }
                        return 'transparent'
                      })()
                      return {
                        color: colIdx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: colIdx === 0 ? 600 : 400,
                        borderLeft,
                        backgroundColor,
                      }
                    })()}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
