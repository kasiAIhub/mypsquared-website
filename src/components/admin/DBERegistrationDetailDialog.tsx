import { useMemo, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Mail, X, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type DBERegistration = Tables<'dbe_registrations'>;

interface Props {
  registration: DBERegistration;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

type StatusAction = {
  key: 'submitted' | 'acknowledged' | 'approved';
  label: string;
  field: 'dbe_submitted_by_parent_at' | 'dbe_submission_status' | 'dbe_approval_received_at';
};

const STATUS_ACTIONS: StatusAction[] = [
  { key: 'submitted', label: 'Mark as Submitted to DBE', field: 'dbe_submitted_by_parent_at' },
  { key: 'acknowledged', label: 'Mark as Acknowledged', field: 'dbe_submission_status' },
  { key: 'approved', label: 'Mark as Approved ✓', field: 'dbe_approval_received_at' },
];

export const DBERegistrationDetailDialog = ({ registration, open, onClose, onUpdated }: Props) => {
  const { toast } = useToast();
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const existingNotes = useMemo(() => {
    try {
      return JSON.parse(registration.internal_notes || '{}');
    } catch {
      return {};
    }
  }, [registration.internal_notes]);

  const referenceNumber = existingNotes.referenceNumber || '';

  async function handleStatusUpdate(action: StatusAction) {
    setUpdating(action.key);
    const updates: Partial<DBERegistration> = {
      dbe_submission_status: action.key,
    };

    if (action.field === 'dbe_submitted_by_parent_at') {
      updates.dbe_submitted_by_parent_at = new Date().toISOString();
    }
    if (action.field === 'dbe_approval_received_at') {
      updates.dbe_approval_received_at = new Date().toISOString();
      updates.dbe_submission_status = 'approved';
    }

    if (adminNote.trim()) {
      updates.internal_notes = JSON.stringify({
        ...existingNotes,
        adminNote: adminNote.trim(),
        adminNoteAt: new Date().toISOString(),
      });
    }

    const { error } = await supabase
      .from('dbe_registrations')
      .update(updates)
      .eq('id', registration.id);

    setUpdating(null);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Status updated', description: action.label });
      setAdminNote('');
      onUpdated();
    }
  }

  const emailSubject = `Your P-Squared DBE Application — ${referenceNumber}`;
  const emailBody = `Dear ${registration.parent_full_name},\n\n`;
  const mailtoHref = `mailto:${registration.parent_email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[92vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl">DBE Registration Details</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {referenceNumber && <span className="font-mono text-emerald-700">{referenceNumber} · </span>}
            Submitted {new Date(registration.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-5 space-y-6">
            {/* Child & Parent */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Child & Parent</h3>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Child Name" value={registration.child_full_name} />
                <Info label="Grade" value={registration.grade} />
                <Info label="Date of Birth" value={registration.child_date_of_birth} />
                <Info label="Province" value={registration.province} />
                <Info label="Parent Name" value={registration.parent_full_name} />
                <Info label="Parent Email" value={registration.parent_email} />
                <Info label="Parent Phone" value={registration.parent_phone || '—'} />
                <Info label="Curriculum" value={registration.chosen_curriculum || '—'} />
                <Info label="Address" value={`${registration.street_address}, ${registration.suburb}, ${registration.city} ${registration.postal_code}`} />
              </div>
            </section>

            <Separator />

            {/* Payment */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Status" value={registration.payment_status || 'pending'} />
                <Info label="Amount" value={registration.payment_amount ? `R${registration.payment_amount}` : '—'} />
                <Info label="Method" value={registration.payment_method || '—'} />
                <Info label="Received At" value={registration.payment_received_at ? new Date(registration.payment_received_at).toLocaleString('en-ZA') : '—'} />
              </div>
            </section>

            <Separator />

            {/* DBE Status */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">DBE Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Submission Status" value={registration.dbe_submission_status || 'pending'} />
                <Info label="Submitted By Parent" value={registration.dbe_submitted_by_parent_at ? new Date(registration.dbe_submitted_by_parent_at).toLocaleDateString('en-ZA') : '—'} />
                <Info label="Approved" value={registration.dbe_approval_received_at ? new Date(registration.dbe_approval_received_at).toLocaleDateString('en-ZA') : '—'} />
                <Info label="DBE Reference" value={registration.dbe_reference_number || '—'} />
              </div>
            </section>

            <Separator />

            {/* Status update controls */}
            <section className="bg-muted/40 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Update Application Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {STATUS_ACTIONS.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleStatusUpdate(action)}
                    disabled={updating !== null}
                    className="bg-gray-700 hover:bg-emerald-700 text-gray-100 text-xs px-3 py-2 rounded-lg text-left transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {updating === action.key ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Optional admin note (saved with status update)…"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground text-xs mt-3 resize-none"
                rows={2}
              />
              {existingNotes.adminNote && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  <span className="font-medium">Last admin note:</span> {existingNotes.adminNote}
                  {existingNotes.adminNoteAt && (
                    <> · {new Date(existingNotes.adminNoteAt).toLocaleString('en-ZA')}</>
                  )}
                </p>
              )}

              <a
                href={mailtoHref}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 text-xs px-3 py-2 rounded-lg mt-3 w-full justify-center transition"
              >
                <Mail className="h-3 w-3" />
                Email {registration.parent_full_name}
              </a>
            </section>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
          {referenceNumber && (
            <a
              href={`/my-application/${referenceNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:text-emerald-700 underline"
            >
              View parent status page →
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5 break-words">{value}</p>
    </div>
  );
}
