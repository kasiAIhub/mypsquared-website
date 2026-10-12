import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Download } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type WaitlistSignup = Tables<'homeschooling_coach_waitlist'>;

interface Props {
  waitlist: WaitlistSignup[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

const SOURCE_STYLES: Record<string, string> = {
  homepage: 'bg-gray-100 text-gray-700',
  'post-assessment': 'bg-emerald-100 text-emerald-800',
  tiktok: 'bg-blue-100 text-blue-800',
  'dbe-confirmation': 'bg-purple-100 text-purple-800',
};

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

export function WaitlistTab({ waitlist, onRefresh, onDelete }: Props) {
  const stats = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    return {
      total: waitlist.length,
      week: waitlist.filter(w => now - new Date(w.created_at).getTime() <= 7 * day).length,
      today: waitlist.filter(w => new Date(w.created_at).getTime() >= startOfToday.getTime()).length,
      withAssessment: waitlist.filter(w => !!w.assessment_id).length,
    };
  }, [waitlist]);

  const exportCSV = () => {
    const headers = ['Date', 'Email', 'Name', 'Phone', 'Source', 'Assessment ID'];
    const escape = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const rows = waitlist.map(w => [
      formatDate(w.created_at),
      w.email,
      w.name || '',
      w.phone || '',
      w.source || '',
      w.assessment_id || '',
    ].map(escape).join(','));
    const csv = [headers.map(escape).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psquared-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Waitlist" value={stats.total} />
        <StatCard label="This Week" value={stats.week} />
        <StatCard label="Today" value={stats.today} />
        <StatCard label="With Assessment" value={stats.withAssessment} />
      </div>

      <div className="bg-background rounded-lg border border-border shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">My Learning Coach Waitlist</h2>
              <p className="text-sm text-muted-foreground">{waitlist.length} signups</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV} disabled={waitlist.length === 0}>
                <Download className="h-4 w-4 mr-2" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={onRefresh}>Refresh</Button>
            </div>
          </div>

          {waitlist.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No waitlist signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Assessment</th>
                    <th className="text-right py-3 px-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry) => {
                    const src = entry.source || 'homepage';
                    const cls = SOURCE_STYLES[src] || 'bg-gray-100 text-gray-700';
                    return (
                      <tr key={entry.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">{formatDate(entry.created_at)}</td>
                        <td className="py-3 px-3 font-medium">{entry.email}</td>
                        <td className="py-3 px-3 text-muted-foreground">{entry.name || '—'}</td>
                        <td className="py-3 px-3 text-muted-foreground">{entry.phone || '—'}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${cls}`}>{src}</span>
                        </td>
                        <td className="py-3 px-3">
                          {entry.assessment_id
                            ? <span className="text-emerald-600 font-medium">Yes ✓</span>
                            : <span className="text-gray-400">No</span>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => onDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
