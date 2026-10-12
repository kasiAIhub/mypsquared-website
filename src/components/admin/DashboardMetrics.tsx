import { Card, CardContent } from '@/components/ui/card';
import { Users, CalendarDays, CalendarClock, Clock } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Assessment = Tables<'assessments'>;

interface DashboardMetricsProps {
  leads: Assessment[];
  loading: boolean;
}

export const DashboardMetrics = ({ leads, loading }: DashboardMetricsProps) => {
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalLeads = leads.length;
  const thisMonth = leads.filter(l => new Date(l.created_at) >= startOfMonth).length;
  const thisWeek = leads.filter(l => new Date(l.created_at) >= startOfWeek).length;
  const today = leads.filter(l => new Date(l.created_at) >= startOfToday).length;

  const metrics = [
    { title: 'Total Assessments', value: totalLeads, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'This Month', value: thisMonth, icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
    { title: 'This Week', value: thisWeek, icon: CalendarClock, color: 'text-purple-600 bg-purple-50' },
    { title: 'Today', value: today, icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3"></div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
