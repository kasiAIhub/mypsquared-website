import { ReactNode } from 'react';

interface DocumentCalloutProps {
  items: ReactNode[];
  intro?: string;
}

export default function DocumentCallout({ items, intro }: DocumentCalloutProps) {
  return (
    <div
      style={{
        background: '#fef9ee',
        border: '0.5px solid #f59e0b',
        borderRadius: 10,
        padding: '14px 16px',
        marginTop: 16,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e', margin: 0 }}>
        📎 Documents to prepare
      </p>
      {intro && (
        <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.7, marginTop: 8, marginBottom: 4 }}>
          {intro}
        </p>
      )}
      <ul style={{ margin: '6px 0 0 0', padding: 0, listStyle: 'none' }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 12, color: '#78350f', lineHeight: 1.7 }}>
            <span style={{ marginRight: 6 }}>□</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
