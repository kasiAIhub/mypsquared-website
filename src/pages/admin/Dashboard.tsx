import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { LeadDetailsDialog } from '@/components/admin/LeadDetailsDialog';
import { DBERegistrationsTable } from '@/components/admin/DBERegistrationsTable';
import { WaitlistTab } from '@/components/admin/WaitlistTab';
import { LearnerWaitlistTab } from '@/components/admin/LearnerWaitlistTab';
import { FunnelAnalytics } from '@/components/admin/FunnelAnalytics';
import { LogOut, Download, ClipboardList, FileText, Users, Trash2, Database, TrendingUp } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { Json } from '@/integrations/supabase/types';

type Assessment = Tables<'assessments'>;
type WaitlistSignup = Tables<'homeschooling_coach_waitlist'>;
type DBERegistration = Tables<'dbe_registrations'>;

export default function Dashboard() {
  const [leads, setLeads] = useState<Assessment[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistSignup[]>([]);
  const [dbeRegistrations, setDbeRegistrations] = useState<DBERegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbeLoading, setDbeLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Assessment | null>(null);
  const [activeTab, setActiveTab] = useState<'assessments' | 'waitlist' | 'learnerWaitlist' | 'dbe' | 'funnel'>('assessments');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
    fetchWaitlist();
    fetchDbeRegistrations();
    const interval = setInterval(fetchWaitlist, 60_000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch assessments', variant: 'destructive' });
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const fetchWaitlist = async () => {
    const { data, error } = await supabase
      .from('homeschooling_coach_waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setWaitlist(data || []);
    }
  };

  const fetchDbeRegistrations = async () => {
    setDbeLoading(true);
    const { data, error } = await supabase
      .from('dbe_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch DBE registrations', variant: 'destructive' });
    } else {
      setDbeRegistrations(data || []);
    }
    setDbeLoading(false);
  };

  const deleteWaitlistEntry = async (id: string) => {
    const { error } = await supabase.from('homeschooling_coach_waitlist').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete entry', variant: 'destructive' });
    } else {
      setWaitlist(prev => prev.filter(w => w.id !== id));
      toast({ title: 'Deleted', description: 'Waitlist entry removed' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const exportToCSV = (filteredLeads: Assessment[]) => {
    const headers = [
      'Date Submitted', 'Child Name', 'Grade', 'Parent Email', 'Parent Phone',
      'Learning Style', 'Top Curriculum',
      'Circumstance Triggers', 'Circumstance Other',
      'Mission', 'Values', 'Goal 1', 'Goal 2', 'Goal 3',
      'Desired Services', 'PDF Downloaded', 'Download Count'
    ];

    const rows = filteredLeads.map(lead => {
      const goals = lead.goals as { goal_1?: string; goal_2?: string; goal_3?: string } | null;
      const triggers = (lead.circumstance_triggers || []).join('|');

      return [
        new Date(lead.created_at).toLocaleDateString('en-ZA'),
        lead.child_name,
        lead.grade,
        lead.parent_email,
        lead.parent_phone || '',
        lead.learning_style,
        lead.top_curriculum || '',
        triggers,
        lead.circumstance_other || '',
        lead.mission || '',
        lead.values || '',
        goals?.goal_1 || '',
        goals?.goal_2 || '',
        goals?.goal_3 || '',
        lead.desired_services || '',
        lead.pdf_generated ? 'Yes' : 'No',
        String(lead.pdf_download_count || 0),
      ];
    });

    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map(row => row.map(escape).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `P-Squared_Assessments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({ title: 'Success', description: `Exported ${filteredLeads.length} assessments to CSV` });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-foreground">
              <span className="text-emerald-600">P²</span> Admin
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === 'assessments' ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground'}
                onClick={() => setActiveTab('assessments')}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Assessment Responses
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === 'waitlist' ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground'}
                onClick={() => setActiveTab('waitlist')}
              >
                <Users className="h-4 w-4 mr-2" />
                Coach Waitlist
                <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">{waitlist.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === 'learnerWaitlist' ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground'}
                onClick={() => setActiveTab('learnerWaitlist')}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Waitlist
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === 'dbe' ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground'}
                onClick={() => setActiveTab('dbe')}
              >
                <FileText className="h-4 w-4 mr-2" />
                DBE Registrations
                <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">{dbeRegistrations.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === 'funnel' ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground'}
                onClick={() => setActiveTab('funnel')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Funnel
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button onClick={() => navigate('/admin/migrate-data')} variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" /> Migrate localStorage
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'assessments' && (
          <>
            <DashboardMetrics leads={leads} loading={loading} />
            <div className="bg-background rounded-lg border border-border shadow-sm">
              <div className="p-6">
                <LeadsTable
                  leads={leads}
                  loading={loading}
                  onRefresh={fetchLeads}
                  onExport={exportToCSV}
                  onViewDetails={setSelectedLead}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'waitlist' && (
          <WaitlistTab
            waitlist={waitlist}
            onRefresh={fetchWaitlist}
            onDelete={deleteWaitlistEntry}
          />
        )}

        {activeTab === 'learnerWaitlist' && <LearnerWaitlistTab />}

        {activeTab === 'dbe' && (
          <div className="bg-background rounded-lg border border-border shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">DBE Registrations</h2>
                <p className="text-sm text-muted-foreground">{dbeRegistrations.length} total submissions</p>
              </div>
              <DBERegistrationsTable
                registrations={dbeRegistrations}
                loading={dbeLoading}
                onRefresh={fetchDbeRegistrations}
              />
            </div>
          </div>
        )}

        {activeTab === 'funnel' && (
          <div className="bg-background rounded-lg border border-border shadow-sm">
            <div className="p-6">
              <FunnelAnalytics />
            </div>
          </div>
        )}
      </main>

      {selectedLead && (
        <LeadDetailsDialog
          lead={selectedLead}
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
