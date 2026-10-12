import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Database, CheckCircle2 } from 'lucide-react';
import { generateProfileAnalysis } from '@/lib/learningProfileAnalysis';
import type { LearningProfileData } from '@/types/learningProfile';

interface FoundItem {
  source: string;
  raw: unknown;
  preview: {
    childName: string;
    parentEmail: string;
    grade: string;
  };
  payload: Record<string, unknown>;
}

export default function MigrateData() {
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [foundData, setFoundData] = useState<FoundItem[]>([]);
  const [migrated, setMigrated] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  const buildPayloadFromLearningProfile = (data: LearningProfileData): Record<string, unknown> | null => {
    if (!data.intakeData || !data.answers) return null;
    const analysis = generateProfileAnalysis(data);
    const { intakeData, answers } = data;

    const getAnswer = (id: string) => answers.find(a => a.questionId === id)?.answer;
    const getOther = (id: string) => answers.find(a => a.questionId === id)?.otherText || null;

    const learningStyleScores: Record<string, unknown> = {};
    answers.forEach(a => { learningStyleScores[a.questionId] = a.answer; });

    return {
      child_name: intakeData.childName || 'Unknown',
      grade: intakeData.currentGrade || 'Not specified',
      parent_name: intakeData.parentName || null,
      parent_email: intakeData.parentEmail || 'not-provided@example.com',
      parent_phone: intakeData.parentPhone || null,
      learning_style: analysis.learningStyle.primary,
      learning_style_scores: learningStyleScores,
      curriculum_recommendations: {
        strengths: analysis.strengths,
        challenges: analysis.challenges,
        recommendations: analysis.recommendations,
      },
      top_curriculum: null,
      circumstance_triggers: (getAnswer('q15') as string[]) || [],
      circumstance_other: getOther('q15'),
      education_priorities: (getAnswer('q16') as string[]) || [],
      parenting_approach: (getAnswer('q17') as string) || null,
      mission: getOther('q16'),
      goals: getAnswer('q18') ? JSON.parse(JSON.stringify(getAnswer('q18'))) : null,
      desired_services: (getAnswer('q19') as string) || null,
    };
  };

  const buildPayloadFromGeneric = (key: string, data: Record<string, unknown>): Record<string, unknown> | null => {
    const childName = (data.child_name || data.childName) as string | undefined;
    if (!childName) return null;
    return {
      child_name: childName,
      grade: (data.grade as string) || 'Not specified',
      parent_email: (data.parent_email || data.email) as string || 'not-provided@example.com',
      parent_phone: (data.parent_phone || data.phone) as string || null,
      parent_name: (data.parent_name || data.parentName) as string || null,
      learning_style: (data.topLearningStyle || data.learning_style) as string || 'Not calculated',
      learning_style_scores: data.learningStyleScores || data.learning_style_scores || {},
      curriculum_recommendations: data.curriculumRecs || data.curriculum_recommendations || {},
      top_curriculum: (data.topCurriculum || data.top_curriculum) as string || null,
      circumstance_triggers: (data.circumstance_triggers || []) as string[],
      circumstance_other: (data.circumstance_other as string) || null,
      education_priorities: (data.education_priorities || []) as string[],
      parenting_approach: (data.parenting_approach as string) || null,
      goals: data.goals || null,
      desired_services: (data.desired_services as string) || null,
    };
  };

  const scanLocalStorage = () => {
    setScanning(true);
    const found: FoundItem[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key);
      if (!value) continue;

      try {
        const parsed = JSON.parse(value);

        // Pattern 1: LearningProfileData (the actual current shape)
        if (parsed.intakeData && parsed.answers && Array.isArray(parsed.answers)) {
          const payload = buildPayloadFromLearningProfile(parsed as LearningProfileData);
          if (payload) {
            found.push({
              source: key,
              raw: parsed,
              preview: {
                childName: (payload.child_name as string) || 'Unknown',
                parentEmail: (payload.parent_email as string) || '—',
                grade: (payload.grade as string) || '—',
              },
              payload,
            });
          }
          continue;
        }

        // Pattern 2: generic shape with child_name / childName
        if (typeof parsed === 'object' && parsed !== null && (parsed.child_name || parsed.childName)) {
          const payload = buildPayloadFromGeneric(key, parsed);
          if (payload) {
            found.push({
              source: key,
              raw: parsed,
              preview: {
                childName: (payload.child_name as string) || 'Unknown',
                parentEmail: (payload.parent_email as string) || '—',
                grade: (payload.grade as string) || '—',
              },
              payload,
            });
          }
        }
      } catch {
        // not JSON, skip
      }
    }

    setFoundData(found);
    setScanning(false);

    if (found.length === 0) {
      toast({ title: 'No data found', description: 'No assessment data was found in this browser.' });
    } else {
      toast({ title: `Found ${found.length} assessment(s)`, description: 'Review and migrate below.' });
    }
  };

  const migrateToDatabase = async () => {
    if (foundData.length === 0) return;
    setMigrating(true);
    let success = 0;
    let failed = 0;

    for (const item of foundData) {
      // Skip if this email + child_name already exists in DB to avoid duplicates
      const childName = item.payload.child_name as string;
      const email = item.payload.parent_email as string;

      const { data: existing } = await supabase
        .from('assessments')
        .select('id')
        .eq('child_name', childName)
        .eq('parent_email', email)
        .maybeSingle();

      if (existing) {
        success++;
        continue;
      }

      const { error } = await supabase.from('assessments').insert([item.payload as never]);
      if (error) {
        console.error('Migration insert failed for', item.source, error);
        failed++;
      } else {
        success++;
      }
    }

    setResults({ success, failed });
    setMigrated(true);
    setMigrating(false);
    toast({
      title: 'Migration complete',
      description: `${success} migrated, ${failed} failed.`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              Migrate localStorage Data to Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              This tool scans this browser's localStorage for assessment data and saves it to the database
              so it appears in the admin dashboard. Only run this on a device that has completed assessments.
            </p>

            <Button onClick={scanLocalStorage} disabled={scanning} className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              {scanning ? 'Scanning...' : 'Scan localStorage'}
            </Button>

            {foundData.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  Found {foundData.length} assessment(s):
                </h3>
                <div className="space-y-2">
                  {foundData.map((item, idx) => (
                    <div key={idx} className="border border-border rounded-md p-3 bg-background text-sm">
                      <div className="font-mono text-xs text-muted-foreground mb-1">{item.source}</div>
                      <div><span className="text-muted-foreground">Child:</span> {item.preview.childName}</div>
                      <div><span className="text-muted-foreground">Email:</span> {item.preview.parentEmail}</div>
                      <div><span className="text-muted-foreground">Grade:</span> {item.preview.grade}</div>
                    </div>
                  ))}
                </div>

                {!migrated && (
                  <Button
                    onClick={migrateToDatabase}
                    disabled={migrating}
                    className="bg-emerald-600 hover:bg-emerald-700 w-full"
                  >
                    {migrating ? 'Migrating...' : `Migrate ${foundData.length} record(s) to Database`}
                  </Button>
                )}

                {migrated && (
                  <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-emerald-900">Migration complete</p>
                      <p className="text-emerald-800">
                        {results.success} succeeded, {results.failed} failed. Existing duplicates were skipped.
                      </p>
                      <Button
                        variant="link"
                        className="text-emerald-700 px-0 h-auto"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        Go to Dashboard →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
