import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { openWhatsApp } from '@/lib/whatsapp';

type Assessment = Tables<'assessments'>;

interface LeadDetailsDialogProps {
  lead: Assessment;
  open: boolean;
  onClose: () => void;
}

const CIRCUMSTANCE_LABELS: Record<string, string> = {
  safety: 'Safety concerns (bullying, violence)',
  learning_needs: 'Learning needs not met',
  family_change: 'Family structure change',
  relocation: 'Relocation',
  economic: 'Economic shift',
  caregiving: 'Caregiving arrangement',
  health: 'Health reasons',
  schedule: 'Schedule flexibility needed',
  values_misalignment: 'Values misalignment',
  faith: 'Faith-based education preference',
  pandemic: 'Pandemic impact',
};

const PRIORITY_LABELS: Record<string, string> = {
  own_pace: 'Freedom to learn at their own pace',
  safe_environment: 'Safe, judgment-free environment',
  family_values: 'Family values/beliefs integrated',
  strong_academics: 'Strong academics and achievement',
  character_development: 'Character and virtue development',
  healing_confidence: 'Healing and building confidence',
  unique_learning_style: 'Flexibility for unique learning style',
  real_world_skills: 'Real-world skills and practical knowledge',
  creative_expression: 'Creative expression and exploration',
  community_connection: 'Community and social connection',
  independence: 'Independence and self-directed learning',
};

const APPROACH_LABELS: Record<string, string> = {
  A: 'Guide & support — remove barriers, let them become themselves',
  B: 'Stability & healing — safe, flexible space after difficult transition',
  C: 'Intentional shaping — pass on values and character through education',
  D: 'Exploring — not sure yet, finding what works best',
  E: 'Combination — mixed approach',
};

function BarChart({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-36 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium w-12 text-right">{value}</span>
    </div>
  );
}

export const LeadDetailsDialog = ({ lead, open, onClose }: LeadDetailsDialogProps) => {
  const scores = lead.learning_style_scores as Record<string, any> | null;
  const goals = lead.goals as { goal_1?: string; goal_2?: string; goal_3?: string } | null;
  const currRecs = lead.curriculum_recommendations as Record<string, any> | null;

  // Try to extract learning style scores from the raw answer data
  const q1Answers = scores?.q1 as string[] | undefined;
  const styleCounts: Record<string, number> = {};
  if (q1Answers && Array.isArray(q1Answers)) {
    q1Answers.forEach((s, i) => {
      styleCounts[s] = q1Answers.length - i;
    });
  }

  const whatsappMessage = `Hi! This is P-Squared Admin following up on ${lead.child_name}'s learning assessment. How can we help you with the next steps?`;
  const whatsappPhone = lead.parent_phone ? lead.parent_phone.replace(/\D/g, '') : null;

  const handleAdminWhatsApp = () => {
    if (!whatsappPhone) return;
    openWhatsApp(whatsappMessage, whatsappPhone);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Assessment Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Submitted {new Date(lead.created_at).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-5 space-y-6">
            {/* Section 1: Child & Parent Info */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Child & Parent Info</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem label="Child Name" value={lead.child_name} />
                <InfoItem label="Grade" value={lead.grade} />
                <InfoItem label="Parent Name" value={(lead as any).parent_name || 'Not provided'} />
                <InfoItem label="Parent Email" value={lead.parent_email} />
                <InfoItem label="Phone" value={lead.parent_phone || 'Not provided'} />
                <InfoItem label="Date Submitted" value={new Date(lead.created_at).toLocaleString('en-ZA')} />
              </div>
            </section>

            <Separator />

            {/* Section 2: Learning Style Analysis */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Learning Style Analysis</h3>
              <div className="mb-4">
                <span className="text-lg font-semibold text-foreground">{lead.learning_style}</span>
              </div>
              {currRecs?.learningStyle && (
                <p className="text-sm text-muted-foreground mb-4">{(currRecs.learningStyle as any).description}</p>
              )}
              {/* Score bars from raw answers */}
              {scores && (
                <div className="space-y-2">
                  {Object.entries(styleCounts).length > 0 ? (
                    Object.entries(styleCounts).map(([style, count]) => (
                      <BarChart key={style} label={style.charAt(0).toUpperCase() + style.slice(1)} value={count} max={5} color="bg-emerald-500" />
                    ))
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(scores)
                        .filter(([key]) => key.startsWith('q'))
                        .slice(0, 6)
                        .map(([key, val]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key}</span>
                            <span className="font-medium">{typeof val === 'number' ? val : Array.isArray(val) ? val.join(', ') : String(val)}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}
            </section>

            <Separator />

            {/* Section 3: Curriculum Recommendations */}
            {currRecs && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Curriculum Recommendations</h3>
                {currRecs.recommendations && Array.isArray(currRecs.recommendations) && (
                  <ul className="space-y-2">
                    {(currRecs.recommendations as string[]).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {currRecs.strengths && Array.isArray(currRecs.strengths) && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Strengths</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(currRecs.strengths as string[]).map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currRecs.challenges && Array.isArray(currRecs.challenges) && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Challenges</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(currRecs.challenges as string[]).map((c, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <Separator />

            {/* Section 4: Open-Ended Responses */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Open-Ended Responses</h3>
              <div className="space-y-4">
                {lead.circumstance_triggers && lead.circumstance_triggers.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Circumstance Triggers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.circumstance_triggers.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {CIRCUMSTANCE_LABELS[t] || t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.circumstance_other && (
                  <ResponseBlock label="Circumstance (Other)" text={lead.circumstance_other} />
                )}

                {(lead as any).education_priorities && (lead as any).education_priorities.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Education Priorities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {((lead as any).education_priorities as string[]).map((p, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {PRIORITY_LABELS[p] || p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.mission && <ResponseBlock label="Priorities (Other)" text={lead.mission} />}

                {(lead as any).parenting_approach && (
                  <ResponseBlock label="Parenting Approach" text={APPROACH_LABELS[(lead as any).parenting_approach] || (lead as any).parenting_approach} />
                )}

                {goals && (goals.goal_1 || goals.goal_2 || goals.goal_3) && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Goals</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {goals.goal_1 && <li>{goals.goal_1}</li>}
                      {goals.goal_2 && <li>{goals.goal_2}</li>}
                      {goals.goal_3 && <li>{goals.goal_3}</li>}
                    </ol>
                  </div>
                )}

                {lead.desired_services && <ResponseBlock label="Desired Services" text={lead.desired_services} />}
              </div>
            </section>

            <Separator />

            {/* Section 5: PDF Tracking */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">PDF Tracking</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Generated</p>
                  <Badge variant={lead.pdf_generated ? 'default' : 'outline'} className={lead.pdf_generated ? 'bg-emerald-600' : ''}>
                    {lead.pdf_generated ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Download Count</p>
                  <p className="font-semibold">{lead.pdf_download_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Downloaded</p>
                  <p className="text-sm">
                    {lead.pdf_downloaded_at
                      ? new Date(lead.pdf_downloaded_at).toLocaleString('en-ZA')
                      : 'Not yet'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
          <div className="flex gap-2">
            {whatsappPhone && (
              <Button
                onClick={handleAdminWhatsApp}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" /> Contact Parent
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function ResponseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm bg-muted/50 rounded-md p-3 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
