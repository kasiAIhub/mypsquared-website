import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Row = Tables<'learner_blueprint_waitlist'>;

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

// Reads are restricted to admins by the database's access rules.
export function LearnerWaitlistTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('learner_blueprint_waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const exportCSV = () => {
    const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const csv = [
      ['Date', 'Name', 'WhatsApp', 'Grade', 'Curriculum'].map(esc).join(','),
      ...rows.map(r => [formatDate(r.created_at), r.parent_name, r.whatsapp_number, r.grade, r.curriculum].map(esc).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `learner-blueprint-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Learner Blueprint Waitlist</h2>
            <p className="text-sm text-muted-foreground">{rows.length} submissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={rows.length === 0}>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
            <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
          </div>
        </div>
        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  {['Name', 'WhatsApp', 'Grade', 'Curriculum', 'Date'].map(h => (
                    <th key={h} className="py-3 px-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-3 font-medium">{r.parent_name}</td>
                    <td className="py-3 px-3">{r.whatsapp_number}</td>
                    <td className="py-3 px-3">{r.grade}</td>
                    <td className="py-3 px-3">{r.curriculum}</td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
