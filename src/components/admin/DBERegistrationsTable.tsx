import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Download, Eye } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DBERegistrationDetailDialog } from './DBERegistrationDetailDialog';

type DBERegistration = Tables<'dbe_registrations'>;

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'disputed';

function PaymentBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-gray-200 text-gray-700' },
    paid: { label: 'Paid ✓', className: 'bg-green-100 text-green-800 border border-green-300' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border border-red-300' },
    refunded: { label: 'Refunded', className: 'bg-amber-100 text-amber-800 border border-amber-300' },
    disputed: { label: '⚠ Disputed', className: 'bg-red-100 text-red-900 border-2 border-red-500 font-bold animate-pulse' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}

const FILTERS: Array<'All' | 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Disputed'> = ['All', 'Paid', 'Pending', 'Failed', 'Refunded', 'Disputed'];

interface DBERegistrationsTableProps {
  registrations: DBERegistration[];
  loading: boolean;
  onRefresh: () => void;
}

export const DBERegistrationsTable = ({ registrations, loading, onRefresh }: DBERegistrationsTableProps) => {
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Disputed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<DBERegistration | null>(null);

  const paidRegistrations = useMemo(
    () => registrations.filter((r) => r.payment_status === 'paid'),
    [registrations]
  );

  const totalRevenue = useMemo(
    () => paidRegistrations.reduce((sum, r) => sum + Number(r.payment_amount || 999), 0),
    [paidRegistrations]
  );

  const submittedCount = useMemo(
    () => registrations.filter((r) => r.dbe_submitted_by_parent_at).length,
    [registrations]
  );

  const approvedCount = useMemo(
    () => registrations.filter((r) => r.dbe_approval_received_at).length,
    [registrations]
  );

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    paidRegistrations.forEach((r) => {
      const d = new Date(r.created_at);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + Number(r.payment_amount || 999);
    });
    return Object.entries(months)
      .slice(-6)
      .map(([month, revenue]) => ({ month, revenue }));
  }, [paidRegistrations]);

  const provinceData = useMemo(() => {
    const map: Record<string, { count: number; paidCount: number }> = {};
    registrations.forEach((r) => {
      if (!r.province) return;
      if (!map[r.province]) map[r.province] = { count: 0, paidCount: 0 };
      map[r.province].count++;
      if (r.payment_status === 'paid') map[r.province].paidCount++;
    });
    return Object.entries(map)
      .map(([province, data]) => ({ province, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [registrations]);

  const maxProvinceCount = Math.max(1, ...provinceData.map((p) => p.count));

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchesFilter =
        paymentFilter === 'All' || (r.payment_status || 'pending') === paymentFilter.toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        r.parent_email.toLowerCase().includes(term) ||
        r.child_full_name.toLowerCase().includes(term) ||
        r.parent_full_name.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [registrations, paymentFilter, searchTerm]);

  const getReferenceNumber = (r: DBERegistration): string => {
    try {
      const notes = JSON.parse(r.internal_notes || '{}');
      return notes.referenceNumber || '';
    } catch {
      return '';
    }
  };

  function handleExportCSV() {
    const headers = [
      'Reference', 'Date', 'Child Name', 'Grade', 'Province',
      'Parent Name', 'Parent Email', 'Parent Phone',
      'Curriculum', 'Payment Status', 'Payment Amount',
      'Submitted to DBE', 'DBE Status', 'Approved Date',
    ];

    const rows = filtered.map((r) => [
      getReferenceNumber(r),
      new Date(r.created_at).toLocaleDateString('en-ZA'),
      r.child_full_name || '',
      r.grade || '',
      r.province || '',
      r.parent_full_name || '',
      r.parent_email || '',
      r.parent_phone || '',
      r.chosen_curriculum || '',
      r.payment_status || '',
      r.payment_amount ? `R${r.payment_amount}` : '',
      r.dbe_submitted_by_parent_at
        ? new Date(r.dbe_submitted_by_parent_at).toLocaleDateString('en-ZA')
        : '',
      r.dbe_submission_status || '',
      r.dbe_approval_received_at
        ? new Date(r.dbe_approval_received_at).toLocaleDateString('en-ZA')
        : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psquared-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`R${totalRevenue.toLocaleString('en-ZA')}`} accent="text-emerald-600" />
        <StatCard label="Paid Registrations" value={String(paidRegistrations.length)} />
        <StatCard label="Submitted to DBE" value={String(submittedCount)} />
        <StatCard label="Approved" value={String(approvedCount)} accent="text-emerald-600" />
      </div>

      {/* Revenue chart */}
      <Card className="border-border">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue (last 6 months)</h3>
          {monthlyData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No paid registrations yet.</p>
          ) : (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `R${v}`} />
                  <Tooltip
                    formatter={(v: number) => [`R${v.toLocaleString('en-ZA')}`, 'Revenue']}
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Province distribution */}
      <Card className="border-border">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Applications by Province</h3>
          {provinceData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No applications yet.</p>
          ) : (
            <div className="space-y-2">
              {provinceData.map(({ province, count, paidCount }) => (
                <div key={province} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 text-muted-foreground">{province}</span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(count / maxProvinceCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs text-muted-foreground">
                    {paidCount} paid / <span className="font-semibold text-foreground">{count}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search + filter + export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by parent or child name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Button
          onClick={handleExportCSV}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-1">Filter by payment:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition',
              paymentFilter === f
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {registrations.length} registrations
      </div>

      <div className="rounded-md border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Child Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>DBE Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No registrations match the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const refNum = getReferenceNumber(r);
                return (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(r.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-emerald-700">{refNum || '—'}</TableCell>
                    <TableCell className="font-medium text-sm">{r.child_full_name}</TableCell>
                    <TableCell className="text-sm">{r.grade}</TableCell>
                    <TableCell className="text-sm">{r.parent_full_name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{r.parent_email}</TableCell>
                    <TableCell className="text-sm">{r.province}</TableCell>
                    <TableCell>
                      <PaymentBadge status={(r.payment_status as PaymentStatus) || 'pending'} />
                    </TableCell>
                    <TableCell className="text-xs capitalize text-muted-foreground">
                      {r.dbe_approval_received_at ? 'approved' : (r.dbe_submission_status || 'pending')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(r)} className="text-emerald-600 hover:text-emerald-700">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <DBERegistrationDetailDialog
          registration={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            onRefresh();
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={cn('text-2xl font-bold mt-2', accent || 'text-foreground')}>{value}</p>
      </CardContent>
    </Card>
  );
}
