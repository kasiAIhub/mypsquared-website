import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, RefreshCw, Filter, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Assessment = Tables<'assessments'>;

const ROWS_PER_PAGE = 20;

const CIRCUMSTANCE_OPTIONS = [
  { value: 'safety', label: 'Safety concerns' },
  { value: 'learning_needs', label: 'Learning needs' },
  { value: 'family_change', label: 'Family change' },
  { value: 'relocation', label: 'Relocation' },
  { value: 'economic', label: 'Economic shift' },
  { value: 'caregiving', label: 'Caregiving' },
  { value: 'health', label: 'Health reasons' },
  { value: 'schedule', label: 'Schedule flexibility' },
  { value: 'values_misalignment', label: 'Values misalignment' },
  { value: 'faith', label: 'Faith-based' },
  { value: 'pandemic', label: 'Pandemic impact' },
];

const STYLE_COLORS: Record<string, string> = {
  'Visual Learner': 'bg-blue-100 text-blue-800 border-blue-200',
  'Auditory Learner': 'bg-green-100 text-green-800 border-green-200',
  'Kinesthetic Learner': 'bg-orange-100 text-orange-800 border-orange-200',
  'Reading/Writing Learner': 'bg-purple-100 text-purple-800 border-purple-200',
  'Social Learner': 'bg-pink-100 text-pink-800 border-pink-200',
  'Multimodal Learner': 'bg-teal-100 text-teal-800 border-teal-200',
};

interface LeadsTableProps {
  leads: Assessment[];
  loading: boolean;
  onRefresh: () => void;
  onExport: (filtered: Assessment[]) => void;
  onViewDetails: (lead: Assessment) => void;
}

export const LeadsTable = ({ leads, loading, onRefresh, onExport, onViewDetails }: LeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [styleFilter, setStyleFilter] = useState('all');
  const [circumstanceFilters, setCircumstanceFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'created_at' | 'child_name'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const learningStyles = useMemo(
    () => [...new Set(leads.map(l => l.learning_style).filter(Boolean))],
    [leads]
  );

  const filteredLeads = useMemo(() => {
    let result = leads.filter(lead => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term ||
        lead.parent_email.toLowerCase().includes(term) ||
        lead.child_name.toLowerCase().includes(term);

      const leadDate = new Date(lead.created_at);
      const matchesDateFrom = !dateFrom || leadDate >= dateFrom;
      const matchesDateTo = !dateTo || leadDate <= new Date(dateTo.getTime() + 86400000);
      const matchesStyle = styleFilter === 'all' || lead.learning_style === styleFilter;
      const matchesCircumstance = circumstanceFilters.length === 0 ||
        circumstanceFilters.some(cf => (lead.circumstance_triggers || []).includes(cf));

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesStyle && matchesCircumstance;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'created_at') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        cmp = a.child_name.localeCompare(b.child_name);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [leads, searchTerm, dateFrom, dateTo, styleFilter, circumstanceFilters, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ROWS_PER_PAGE));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const toggleCircumstance = (value: string) => {
    setCircumstanceFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setStyleFilter('all');
    setCircumstanceFilters([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = dateFrom || dateTo || styleFilter !== 'all' || circumstanceFilters.length > 0 || searchTerm;

  const handleSort = (field: 'created_at' | 'child_name') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getStyleBadge = (style: string) => {
    const colorClass = STYLE_COLORS[style] || 'bg-muted text-muted-foreground border-border';
    return <Badge variant="outline" className={cn('text-xs font-medium', colorClass)}>{style}</Badge>;
  };

  const getCircumstanceDisplay = (triggers: string[] | null) => {
    if (!triggers || triggers.length === 0) return <span className="text-muted-foreground">—</span>;
    const first = CIRCUMSTANCE_OPTIONS.find(c => c.value === triggers[0])?.label || triggers[0];
    if (triggers.length === 1) return <span className="text-sm">{first}</span>;
    return (
      <span className="text-sm">
        {first} <Badge variant="secondary" className="ml-1 text-[10px]">+{triggers.length - 1}</Badge>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-lg font-medium text-foreground">No assessments submitted yet</p>
        <p className="text-muted-foreground">Share your assessment link to start collecting data!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by child name or parent email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && <span className="ml-1.5 h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>}
          </Button>
          <Button onClick={onRefresh} variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onExport(filteredLeads)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Filters</span>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="ghost" size="sm" className="text-xs h-7">
                <X className="h-3 w-3 mr-1" /> Reset Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Date From */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setCurrentPage(1); }} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setCurrentPage(1); }} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Learning Style */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Learning Style</label>
              <Select value={styleFilter} onValueChange={(v) => { setStyleFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  {learningStyles.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Circumstance Multi-Select */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Circumstances</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal h-9 text-sm">
                    {circumstanceFilters.length === 0
                      ? <span className="text-muted-foreground">All</span>
                      : <span>{circumstanceFilters.length} selected</span>
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 pointer-events-auto" align="start">
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {CIRCUMSTANCE_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
                        <input
                          type="checkbox"
                          checked={circumstanceFilters.includes(opt.value)}
                          onChange={() => toggleCircumstance(opt.value)}
                          className="rounded border-border"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLeads.length} of {leads.length} assessments
      </div>

      {/* Data Table */}
      <div className="rounded-md border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort('created_at')}>
                Date {sortField === 'created_at' && (sortDir === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort('child_name')}>
                Child Name {sortField === 'child_name' && (sortDir === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Parent Name</TableHead>
              <TableHead>Parent Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Learning Style</TableHead>
              <TableHead className="hidden lg:table-cell">Curriculum</TableHead>
              <TableHead className="hidden xl:table-cell">Circumstance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No assessments match your filters
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/30">
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(lead.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{lead.child_name}</TableCell>
                  <TableCell className="text-sm">{lead.grade}</TableCell>
                  <TableCell className="font-medium text-sm">{(lead as any).parent_name || '—'}</TableCell>
                  <TableCell className="text-sm">{lead.parent_email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {lead.parent_phone || '—'}
                  </TableCell>
                  <TableCell>{getStyleBadge(lead.learning_style)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {lead.top_curriculum ? (
                      <Badge variant="outline" className="text-xs">{lead.top_curriculum}</Badge>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {getCircumstanceDisplay(lead.circumstance_triggers)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(lead)} className="text-emerald-600 hover:text-emerald-700">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn("w-9", currentPage === page && "bg-emerald-600 hover:bg-emerald-700")}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
