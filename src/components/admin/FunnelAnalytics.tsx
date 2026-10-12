import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

type FunnelEvent = {
  id: string;
  created_at: string;
  session_id: string;
  event_type: string;
  step_number: number | null;
  step_name: string | null;
  province: string | null;
};

type RangeKey = '7' | '30' | '90' | 'all';

const RANGE_LABELS: Record<RangeKey, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '90': 'Last 90 days',
  all: 'All time',
};

const SA_PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape',
];

export function FunnelAnalytics() {
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('30');

  const fetchEvents = async (r: RangeKey) => {
    setLoading(true);
    let query = supabase
      .from('dbe_funnel_events')
      .select('id, created_at, session_id, event_type, step_number, step_name, province')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (r !== 'all') {
      const days = parseInt(r, 10);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', since);
    }

    const { data } = await query;
    setEvents((data || []) as FunnelEvent[]);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(range); }, [range]);

  // Helper: count unique sessions matching predicate
  const uniqueSessions = useMemo(() => (
    (eventType: string, stepNumber?: number) => {
      const set = new Set<string>();
      for (const e of events) {
        if (e.event_type !== eventType) continue;
        if (stepNumber !== undefined && e.step_number !== stepNumber) continue;
        set.add(e.session_id);
      }
      return set.size;
    }
  ), [events]);

  // Funnel rows
  const funnelRows = useMemo(() => ([
    { name: 'Page views',         count: uniqueSessions('page_view') },
    { name: 'Province selected',  count: uniqueSessions('province_selected') },
    { name: 'Step 1 completed',   count: uniqueSessions('step_completed', 1) },
    { name: 'Step 2 completed',   count: uniqueSessions('step_completed', 2) },
    { name: 'Step 3 completed',   count: uniqueSessions('step_completed', 3) },
    { name: 'Step 4 completed',   count: uniqueSessions('step_completed', 4) },
    { name: 'Step 5 completed',   count: uniqueSessions('step_completed', 5) },
    { name: 'Payment initiated',  count: uniqueSessions('payment_initiated') },
    { name: 'Payment completed',  count: uniqueSessions('payment_completed') },
    { name: 'Package downloaded', count: uniqueSessions('package_downloaded') },
  ]), [uniqueSessions]);

  const topCount = funnelRows[0]?.count || 0;

  // Identify worst drop-off step (lowest continuation %)
  const worstIndex = useMemo(() => {
    let worst = -1;
    let worstPct = 101;
    for (let i = 1; i < funnelRows.length; i++) {
      const prev = funnelRows[i - 1].count;
      if (prev === 0) continue;
      const pct = Math.round((funnelRows[i].count / prev) * 100);
      if (pct < worstPct) { worstPct = pct; worst = i; }
    }
    return worst;
  }, [funnelRows]);

  // Province breakdown
  const provinceRows = useMemo(() => {
    return SA_PROVINCES.map(province => {
      const startedSet = new Set<string>();
      const completedSet = new Set<string>();
      for (const e of events) {
        if (e.province !== province) continue;
        if (e.event_type === 'province_selected') startedSet.add(e.session_id);
        if (e.event_type === 'payment_completed') completedSet.add(e.session_id);
      }
      const started = startedSet.size;
      const completed = completedSet.size;
      const rate = started > 0 ? Math.round((completed / started) * 100) : 0;
      return { province, started, completed, rate };
    })
    .filter(r => r.started > 0)
    .sort((a, b) => b.started - a.started);
  }, [events]);

  // Summary cards
  const totalSessions = uniqueSessions('page_view');
  const reachedPayment = uniqueSessions('payment_initiated');
  const converted = uniqueSessions('payment_completed');
  const conversionRate = totalSessions > 0
    ? ((converted / totalSessions) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header + range pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Funnel Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Anonymous behavioural data from the DBE registration flow
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(Object.keys(RANGE_LABELS) as RangeKey[]).map(k => (
            <Button
              key={k}
              variant={range === k ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRange(k)}
            >
              {RANGE_LABELS[k]}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => fetchEvents(range)} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total sessions started" value={totalSessions} />
        <StatCard label="Reached payment" value={reachedPayment} />
        <StatCard label="Converted to paid" value={converted} />
        <StatCard label="Overall conversion rate" value={`${conversionRate}%`} />
      </div>

      {/* Funnel */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Step drop-off
          </h3>
          {totalSessions === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No funnel data yet for this period.
            </p>
          ) : (
            <div className="space-y-3">
              {funnelRows.map((row, index) => {
                const prevCount = index > 0 ? funnelRows[index - 1].count : row.count;
                const dropoff = prevCount > 0 ? Math.round((row.count / prevCount) * 100) : 0;
                const widthPct = topCount > 0 ? Math.max(2, (row.count / topCount) * 100) : 0;
                const isWorst = index === worstIndex && index > 0;

                return (
                  <div
                    key={row.name}
                    className={cn(
                      'p-3 rounded-md border',
                      isWorst ? 'border-amber-400 bg-amber-50' : 'border-border bg-background',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                      <span className="font-medium text-sm">{row.name}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-mono font-semibold">{row.count}</span>
                        <span className="text-muted-foreground">
                          {index === 0 ? '—' : `${dropoff}% continued`}
                        </span>
                        {isWorst && (
                          <span className="text-amber-700 font-medium text-xs">
                            ← Focus here
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isWorst ? 'bg-amber-500' : 'bg-emerald-500',
                        )}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Province breakdown */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Province conversion
          </h3>
          {provinceRows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No province data yet for this period.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Province</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Started</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Completed</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {provinceRows.map(r => (
                    <tr key={r.province} className="border-b border-border hover:bg-muted/30">
                      <td className="py-2 px-3 font-medium">{r.province}</td>
                      <td className="py-2 px-3 text-right font-mono">{r.started}</td>
                      <td className="py-2 px-3 text-right font-mono">{r.completed}</td>
                      <td className={cn(
                        'py-2 px-3 text-right font-mono font-semibold',
                        r.rate < 20 && 'text-red-600',
                        r.rate >= 20 && r.rate <= 40 && 'text-amber-600',
                        r.rate > 40 && 'text-emerald-600',
                      )}>
                        {r.rate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Funnel events store only an anonymous session ID, step, province, and event type — no
        names, emails, or IDs. POPIA-compliant behavioural tracking only.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}
