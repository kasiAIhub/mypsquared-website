import { LearningProfileData, ProfileAnalysis } from '@/types/learningProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { generateLearnerProfilePDF, FullAssessmentData } from '@/lib/pdfGenerator';
import { toast } from '@/hooks/use-toast';

interface ProfileReportProps {
  profileData: LearningProfileData;
  analysis: ProfileAnalysis;
  onStartOver: () => void;
}

export default function ProfileReport({ profileData, analysis, onStartOver }: ProfileReportProps) {

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      // Helper to get answer by question ID
      const getAnswer = (qId: string) => profileData.answers.find(a => a.questionId === qId)?.answer;
      const getOtherText = (qId: string) => profileData.answers.find(a => a.questionId === qId)?.otherText || null;

      const pdfData: FullAssessmentData = {
        childName: profileData.intakeData.childName,
        grade: profileData.intakeData.currentGrade.replace('grade-', 'Grade ').toUpperCase(),
        learningStyle: analysis.learningStyle.primary,
        strengths: analysis.strengths,
        challenges: analysis.challenges,
        recommendations: analysis.recommendations,
        academicReadiness: analysis.academicReadiness,
        socialEmotional: analysis.socialEmotional,
        interestAreas: analysis.interestAreas,
        circumstanceTriggers: (getAnswer('q15') as string[]) || [],
        circumstanceOther: getOtherText('q15'),
        educationPriorities: (getAnswer('q16') as string[]) || [],
        parentingApproach: (getAnswer('q17') as string) || null,
        goals: (getAnswer('q18') as { goal_1: string; goal_2: string; goal_3: string }) || null,
        desiredServices: (getAnswer('q19') as string) || null,
      };

      generateLearnerProfilePDF(pdfData);

      toast({
        title: "PDF Downloaded",
        description: "Your personalized learner profile report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again or use the print option.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 print:shadow-none">
        <div className="flex items-start justify-between mb-6 print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
              Learning Profile Report
            </h1>
            <p className="text-[#64748B]">
              {profileData.intakeData.childName} • Grade {profileData.intakeData.currentGrade.replace('grade-', '').toUpperCase()}
            </p>
            <p className="text-sm text-[#64748B] mt-1">
              Generated {new Date(profileData.completedAt).toLocaleDateString()}
            </p>
          </div>
          <div />

        </div>

        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-3">
          <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Learning Archetype
          </p>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">
            {analysis.learningStyle.primary}
          </h2>
          <p className="text-[#0F172A]">
            {analysis.learningStyle.description}
          </p>
        </div>
        <p className="text-sm italic text-[#94A3B8] mt-2 mb-6 text-center">
          This archetype is a starting point, not a label. It may shift as {profileData.intakeData.childName} grows and encounters new learning experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Academic Readiness
              <span className="text-2xl font-bold text-[#10B981]">
                {analysis.academicReadiness.score}/5
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.academicReadiness.score * 20} className="mb-4" />
            <p className="text-[#0F172A]">{analysis.academicReadiness.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Social-Emotional Development
              <span className="text-2xl font-bold text-[#10B981]">
                {analysis.socialEmotional.score}/5
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.socialEmotional.score * 20} className="mb-4" />
            <p className="text-[#0F172A]">{analysis.socialEmotional.description}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-emerald-500 mr-3 text-xl">✓</span>
                <span className="text-[#0F172A]">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Areas for Growth & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-500 mr-3 text-xl">◆</span>
                <span className="text-[#0F172A]">{challenge}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {analysis.interestAreas.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interest Areas & Hobbies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.interestAreas.map((interest, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-[#10B981] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-[#0F172A]">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>



      <div className="flex flex-wrap gap-2 justify-center mb-6 print:hidden">
        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download Report in PDF
        </Button>
        <Button onClick={onStartOver} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">What's next for {profileData.intakeData.childName}?</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Choose how you'd like to take the next step.
        </p>
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button
            onClick={() => window.location.href = '/dbe-registration'}
            size="lg"
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
          >
            Start DBE Registration — R999
          </Button>
          <Button
            onClick={() => window.location.href = '/learner-blueprint'}
            size="lg"
            variant="outline"
            className="w-full border-emerald-500 text-[#10B981] hover:bg-emerald-50"
          >
            See My Curriculum Recommendation
          </Button>
          <Button
            onClick={() => window.location.href = '/waitlist'}
            variant="ghost"
            className="w-full text-[#10B981] hover:text-[#10B981]"
          >
            Join the Learner Blueprint Waitlist
          </Button>
        </div>
        <p className="text-sm text-[#64748B] text-center mt-6">
          Not ready to homeschool yet?{' '}
          <a href="/waitlist" className="text-[#10B981] underline">
            Join the Learner Blueprint Waitlist
          </a>
          {' '}— Join the waitlist - we open soon, designed for children still in school who need extra support.
        </p>
      </div>


      <div className="bg-[#F5F0E8] rounded-lg p-6 text-center text-sm text-[#64748B] print:hidden">
        <p className="mb-2">
          <strong>Parent Contact:</strong> {profileData.intakeData.parentName} • {profileData.intakeData.parentEmail}
        </p>
        <p className="text-xs text-[#64748B]">
          This report is saved locally in your browser. Download a copy for your records.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.7, textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          P-Squared's learner profile is an educational guidance tool. It does not constitute a psychological, medical, or professional assessment. Results are indicative only and are intended to support parental decision-making. For concerns about learning difficulties, ADHD, or neurodevelopmental conditions, please consult a registered educational psychologist (hpcsa.co.za).
        </p>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none, .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
