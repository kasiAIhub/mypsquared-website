import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, User, MessageSquare, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp, Check, Rocket, Clock, Shield, Star, Download, Gift, Calendar, CircleCheck as CheckCircle, Chrome as Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AssessmentAnswers, AssessmentScore, VocAnswers } from "@/types/assessment";
import { getScoreColor, getScoreBgColor } from "@/lib/scoringLogic";
import { gradeOptions, provinceOptions } from "@/lib/assessmentData";
import { updateLeadVoC, updateLeadReservation } from "@/hooks/useAssessmentLead";
import { openWhatsApp } from "@/lib/whatsapp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/layout/Footer";

const Results = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState<AssessmentScore | null>(null);
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [vocAnswers, setVocAnswers] = useState<VocAnswers>({
    serviceEnhancement: '',
    personalContext: '',
    pricingPreference: ''
  });
  const [vocCompleted, setVocCompleted] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(true);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  const [spotReserved, setSpotReserved] = useState(() => {
    return localStorage.getItem('psquared_spot_reserved') === 'true';
  });
  const [leadId, setLeadId] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [priorityNumber] = useState<number>(() => {
    // Check if we already have a priority number saved
    const saved = localStorage.getItem('psquared_priority_number');
    if (saved) {
      return parseInt(saved);
    }
    // Generate new number (3-30 range) and save it
    const newNumber = Math.floor(Math.random() * 28) + 3;
    localStorage.setItem('psquared_priority_number', newNumber.toString());
    return newNumber;
  });

  const handleUnlockPreviews = async () => {
    if (vocAnswers.serviceEnhancement.length < 10 || vocAnswers.personalContext.length < 10) {
      return;
    }

    // Update database with VoC answers
    if (leadId) {
      await updateLeadVoC(leadId, vocAnswers);
    }

    setVocCompleted(true);
  };

  const handleReserveSpot = async () => {
    const reservationData = {
      ...vocAnswers,
      timestamp: new Date().toISOString(),
      score: score?.totalPoints,
      province: answers?.province,
      grade: answers?.grade,
      email: answers?.email,
      firstName: answers?.firstName,
      childName: answers?.childName,
      priorityNumber,
      action: 'reserve_spot'
    };
    localStorage.setItem('psquared_reservation', JSON.stringify(reservationData));
    localStorage.setItem('psquared_spot_reserved', 'true');
    console.log('Reservation Data Captured:', reservationData);

    // Update database
    if (leadId) {
      await updateLeadReservation(leadId);
    }

    setSpotReserved(true);
  };

  const handlePriceChoice = async (price: string) => {
    // Prevent duplicate sends
    if (messageSent) {
      toast.info('Message already sent!');
      return;
    }

    setMessageSent(true);

    const provinceName = provinceOptions.find(p => p.value === answers?.province)?.label || answers?.province;
    const gradeName = gradeOptions.find(g => g.value === answers?.grade)?.label || answers?.grade;

    // Calculate document readiness
    const missingDocs: string[] = [];
    const readyDocs: string[] = [];

    if (!answers?.documents.birthCertificate) missingDocs.push('Birth certificate');
    else readyDocs.push('Birth certificate ready');

    if (!answers?.documents.parentId) missingDocs.push('Parent ID');
    else readyDocs.push('Parent ID ready');

    if (!answers?.documents.schoolReport) missingDocs.push('School report');
    else readyDocs.push('School report ready');

    if (!answers?.documents.proofOfResidence) missingDocs.push('Proof of residence');
    else readyDocs.push('Proof of residence ready');

    if (!answers?.documents.transferCertificate) missingDocs.push('Transfer certificate');
    else readyDocs.push('Transfer certificate ready');

    // Build detailed WhatsApp message
    const message = `🎯 NEW P-SQUARED LEAD

━━━━━━━━━━━━━━━━━━━
📋 CONTACT INFO
━━━━━━━━━━━━━━━━━━━
Name: ${answers?.firstName || 'Not provided'}
Email: ${answers?.email || 'Not provided'}
Phone: ${answers?.phone || 'Not provided'}
Province: ${provinceName || 'Not provided'}

━━━━━━━━━━━━━━━━━━━
👶 APPLICATION DETAILS
━━━━━━━━━━━━━━━━━━━
Child Name: ${answers?.childName || 'Not provided'}
Current Grade: ${answers?.currentSituation || 'Not provided'}
Target Grade: ${gradeName || 'Not provided'}
Timeline: ${answers?.timeline || 'Not specified'}

━━━━━━━━━━━━━━━━━━━
📊 ASSESSMENT RESULTS
━━━━━━━━━━━━━━━━━━━
Total Score: ${score?.percentage || 0}%
Readiness Level: ${score?.levelLabel || 'Not assessed'}

Missing Documents:
${missingDocs.length > 0 ? missingDocs.map(doc => `• ${doc}`).join('\n') : '✓ All documents ready'}

Strengths:
${readyDocs.length > 0 ? readyDocs.map(doc => `✓ ${doc}`).join('\n') : 'No documents ready yet'}

━━━━━━━━━━━━━━━━━━━
💰 PRICE SELECTED
━━━━━━━━━━━━━━━━━━━
Willing to Pay: ${price}

━━━━━━━━━━━━━━━━━━━
💡 CUSTOMER INSIGHTS
━━━━━━━━━━━━━━━━━━━
Q1: Service Enhancement Feedback
A: ${vocAnswers.serviceEnhancement || 'Not provided'}

Q2: Personal Situation
A: ${vocAnswers.personalContext || 'Not provided'}

━━━━━━━━━━━━━━━━━━━
⏰ SUBMITTED
━━━━━━━━━━━━━━━━━━━
Date/Time: ${new Date().toLocaleString('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })}

━━━━━━━━━━━━━━━━━━━
✅ NEXT STEPS
━━━━━━━━━━━━━━━━━━━
- Call/WhatsApp: ${answers?.phone || 'Contact needed'}
- Email quote to: ${answers?.email || 'Email needed'}
- Follow up within 24 hours
${price === 'Not sure - I have questions' ? '\n- Customer has questions - needs consultation call' : ''}`;

    try {
      // Save price selection to database
      // Price selection logged locally (no longer stored in old assessment_leads table)
      console.log('Price selected:', price);

      // Open WhatsApp
      openWhatsApp(message);

      toast.success('Opening WhatsApp with your details...');

    } catch (err) {
      console.error('Failed to process price selection:', err);
      toast.error('Something went wrong, but opening WhatsApp anyway...');

      // Still try to open WhatsApp even if database save fails
      openWhatsApp(message);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const savedScore = localStorage.getItem('psquared_score');
    const savedAnswers = localStorage.getItem('psquared_assessment');

    if (savedScore && savedAnswers) {
      const parsedScore = JSON.parse(savedScore);
      const parsedAnswers = JSON.parse(savedAnswers);
      setScore(parsedScore);
      setAnswers(parsedAnswers);
      const savedLeadId = localStorage.getItem('psquared_lead_id');
      if (savedLeadId) setLeadId(savedLeadId);
    } else {
      navigate('/assessment');
    }
  }, [navigate, priorityNumber]);

  const handleDownloadGuide = async () => {
    try {
      toast.info('Starting download...', { duration: 2000 });

      const response = await fetch('/FREE-DBE-Home-Education-Preparation-Guide_(3).pdf');
      if (!response.ok) {
        throw new Error('File not found');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FREE-DBE-Home-Education-Preparation-Guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Guide downloaded successfully!');
      console.log('✅ Guide download initiated');
    } catch (error) {
      console.error('❌ Guide download failed:', error);
      toast.error('Download failed. Opening in new tab instead...');
      window.open('/FREE-DBE-Home-Education-Preparation-Guide_(3).pdf', '_blank');
    }
  };

  if (!score || !answers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading results...</div>
      </div>
    );
  }

  const hasUrgentSituation = score.urgencyFlags.informalHomeschooler || 
    score.urgencyFlags.childOutOfSchool || 
    score.urgencyFlags.urgentTimeline;

  const gradeName = gradeOptions.find(g => g.value === answers.grade)?.label || answers.grade;
  const provinceName = provinceOptions.find(p => p.value === answers.province)?.label || answers.province;
  const childDisplayName = answers.childName || "your child";

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-32 h-32 opacity-20">
            <img
              src="https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Parent and child education"
              className="rounded-full object-cover object-center w-full h-full"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your DBE Readiness Results
          </h1>
          <p className="text-muted-foreground">
            {answers.firstName ? `${answers.firstName}, here's` : "Here's"} your personalized assessment for {childDisplayName}
          </p>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border-2 p-8 text-center ${getScoreBgColor(score.level)}`}
        >
          <div className="text-6xl md:text-7xl font-bold mb-2">
            <span className={getScoreColor(score.level)}>{score.totalPoints}</span>
            <span className="text-muted-foreground text-3xl">/{score.maxPoints}</span>
          </div>
          <div className="text-xl font-medium text-foreground mb-2">
            {score.percentage}% Ready
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            score.level === 'green' ? 'bg-primary text-primary-foreground' :
            score.level === 'yellow' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            <Star className="w-4 h-4" />
            {score.levelLabel}
          </div>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            {score.level === 'green' 
              ? `Excellent! You have a strong foundation for ${childDisplayName}'s application. With P-Squared, you'll be ready to submit in 30 minutes.`
              : score.level === 'yellow'
                ? `Good progress! You have the basics covered for ${childDisplayName}. P-Squared will help fill the gaps and strengthen your application.`
                : `You're at the early stages for ${childDisplayName}, but don't worry! Many successful applications started here. P-Squared will guide you step by step.`
            }
          </p>
        </motion.div>

        {/* Breakdown Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* Document Readiness */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Documents</h3>
                <p className="text-sm text-muted-foreground">
                  {score.breakdown.documentScore}/{score.breakdown.documentMax} points
                </p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(score.breakdown.documentScore / score.breakdown.documentMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Parent Readiness */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Parent Profile</h3>
                <p className="text-sm text-muted-foreground">
                  {score.breakdown.parentScore}/{score.breakdown.parentMax} points
                </p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(score.breakdown.parentScore / score.breakdown.parentMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Motivation Strength */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Motivation</h3>
                <p className="text-sm text-muted-foreground">
                  {score.breakdown.motivationScore}/{score.breakdown.motivationMax} points
                </p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(score.breakdown.motivationScore / score.breakdown.motivationMax) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#10B981]/5 to-[#10B981]/10 border-2 border-[#10B981] rounded-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Get Personal Support via WhatsApp
              </h3>
              <p className="text-muted-foreground">
                Chat directly with our founder who has successfully navigated the DBE registration process
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Have questions about your {score?.levelLabel} readiness score?
              Want guidance specific to {provinceName}?
              Let's discuss your situation personally.
            </p>

            <Button
              size="lg"
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-lg py-6"
              onClick={() => {
                const message = `Hi! I just completed the DBE Readiness Assessment and got ${score?.percentage}% (${score?.levelLabel}). I'd like to discuss my application for ${childDisplayName} in ${provinceName}.`;
                openWhatsApp(message);
              }}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat on WhatsApp
            </Button>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Responds within 2 hours
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                100% private
              </span>
            </div>
          </div>
        </motion.section>

        {/* Experienced Homeschooler Recognition */}
        {score.urgencyFlags.experiencedHomeschooler && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  ✅ Experienced Home Educator
                </h3>
                <p className="text-muted-foreground mb-4">
                  You're already familiar with the process - re-registration under BELA Act is often
                  smoother for experienced home educators. Re-registration is typically faster than
                  first-time applications.
                </p>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Your Re-Registration Advantage:</h4>
                  <div className="space-y-2">
                    {[
                      "✓ Already familiar with DBE requirements and language",
                      "✓ Have existing homeschool records to demonstrate success",
                      "✓ Understand the educational plan structure",
                      "✓ Faster processing as a known home educator"
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Urgent Situation Alert */}
        {hasUrgentSituation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  ⚠️ Urgent Situation Detected
                </h3>
                <p className="text-muted-foreground mb-4">
                  {score.urgencyFlags.informalHomeschooler
                    ? `You're currently homeschooling ${childDisplayName} without DBE registration. This is common but needs to be addressed.`
                    : score.urgencyFlags.childOutOfSchool
                      ? `${childDisplayName} is currently out of school. South African law requires registration for education.`
                      : "Your urgent timeline means acting quickly is important."
                  }
                </p>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Your 4-Step Action Plan:</h4>
                  <div className="space-y-2">
                    {[
                      "Week 1: Gather documents (we show you exactly which ones)",
                      "Week 2: Generate your application with P-Squared",
                      "Week 3: Submit to DBE and track your application",
                      "Week 4-8: Await DBE response (we provide follow-up scripts)"
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                          {i + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FREE DBE PREPARATION GUIDE - NO GATE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                🎁 Your Free DBE Preparation Guide
              </h3>
              <p className="text-sm text-muted-foreground">
                Immediate download • No payment required
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            We've created a comprehensive guide to help you navigate the DBE application 
            process—whether you use P-Squared or do it yourself.
          </p>

          {/* Guide Preview */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Week 1: Document Gathering
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  <li>• Unabridged birth certificate checklist</li>
                  <li>• Where to certify documents (FREE options)</li>
                  <li>• The transfer certificate Catch-22 solution</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Week 2: School Coordination
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  <li>• How to request school reports</li>
                  <li>• Notifying schools of your decision</li>
                  <li>• Legal workaround templates</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Week 3: Application Preparation
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  <li>• Motivation letter structure</li>
                  <li>• Educational plan template</li>
                  <li>• CAPS alignment guidance</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Week 4: Submission
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  <li>• Provincial DBE office contacts</li>
                  <li>• Submission checklist</li>
                  <li>• Follow-up timeline (30-45 days)</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">PLUS:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  All 9 provincial DBE contacts
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  Common mistakes to avoid
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  Document certification guide
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  Timeline tracker
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownloadGuide}
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Your Free Guide (PDF)
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-3">
            This guide is yours to keep, whether you use P-Squared or not.
          </p>
        </motion.div>

        {/* VoC Gate for Document Previews */}
        {!vocCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/30 p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                ⚡ Unlock Your Personalized Document Previews
              </h3>
              <p className="text-muted-foreground">
                Answer 2 quick questions to help us tailor your documents perfectly, then see exactly what YOUR application would look like.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  What would make P-Squared even more valuable to you?
                </label>
                <Textarea
                  value={vocAnswers.serviceEnhancement}
                  onChange={(e) => setVocAnswers({ ...vocAnswers, serviceEnhancement: e.target.value })}
                  placeholder="e.g., I'd love if P-Squared could also help with annual reporting submissions, or provide a follow-up service to check application status..."
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {vocAnswers.serviceEnhancement.length < 10
                    ? `Minimum 10 characters (${10 - vocAnswers.serviceEnhancement.length} more needed)`
                    : '✓ Ready'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Is there anything specific about YOUR situation that you'd like P-Squared to consider when generating your documents?
                </label>
                <Textarea
                  value={vocAnswers.personalContext}
                  onChange={(e) => setVocAnswers({ ...vocAnswers, personalContext: e.target.value })}
                  placeholder="e.g., My child has special needs, or we follow the Cambridge curriculum, or we have a unique family situation..."
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {vocAnswers.personalContext.length < 10
                    ? `Minimum 10 characters (${10 - vocAnswers.personalContext.length} more needed)`
                    : '✓ Ready'}
                </p>
              </div>

              <Button
                onClick={handleUnlockPreviews}
                disabled={vocAnswers.serviceEnhancement.length < 10 || vocAnswers.personalContext.length < 10}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6 mt-4"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Show My Personalized Documents
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Full Analysis */}
            {/* Personalization Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">
                📄 {childDisplayName}'s Personalized Document Previews
              </h3>
              <p className="text-muted-foreground mb-6">
                Here's a preview of what P-Squared will generate for {childDisplayName} based on your answers:
              </p>

              <div className="space-y-4">
                {/* Application Form Preview */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                    onClick={() => setExpandedPreview(expandedPreview === 'form' ? null : 'form')}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">DBE Application Form</span>
                    </div>
                    {expandedPreview === 'form' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedPreview === 'form' && (
                    <div className="p-4 bg-card border-t border-border">
                      <div className="font-mono text-sm space-y-2 text-muted-foreground">
                        <p><span className="text-foreground">Child's Name:</span> {answers.childName || "[To be entered]"}</p>
                        <p><span className="text-foreground">Province:</span> {provinceName}</p>
                        <p><span className="text-foreground">Grade Applied For:</span> {gradeName}</p>
                        <p><span className="text-foreground">Parent Qualification:</span> {answers.qualification}</p>
                        <p className="text-primary text-xs mt-2">+ 100 more fields auto-completed...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Motivation Letter Preview */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                    onClick={() => setExpandedPreview(expandedPreview === 'motivation' ? null : 'motivation')}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Motivation Letter (3 pages)</span>
                    </div>
                    {expandedPreview === 'motivation' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedPreview === 'motivation' && (
                    <div className="p-4 bg-card border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        "Following a comprehensive evaluation of our family's educational needs, we have 
                        determined that home education in accordance with the Basic Education Laws Amendment 
                        Act (BELA Act 32 of 2024) best serves {childDisplayName}'s developmental requirements. 
                        This decision is supported by our commitment to providing individualized instruction 
                        aligned with the {gradeName} curriculum standards..."
                      </p>
                      <p className="text-primary text-xs mt-2">+ 2 more pages of professional content...</p>
                    </div>
                  )}
                </div>

                {/* Educational Plan Preview */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                    onClick={() => setExpandedPreview(expandedPreview === 'plan' ? null : 'plan')}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Educational Plan (6-8 pages)</span>
                    </div>
                    {expandedPreview === 'plan' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedPreview === 'plan' && (
                    <div className="p-4 bg-card border-t border-border">
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p><strong className="text-foreground">{childDisplayName}'s {gradeName} CAPS-Aligned Schedule:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Home Language: 6 hours/week</li>
                          <li>Mathematics: 6 hours/week</li>
                          <li>Life Skills/Orientation: 4 hours/week</li>
                          <li>Additional subjects as per CAPS...</li>
                        </ul>
                      </div>
                      <p className="text-primary text-xs mt-2">+ Assessment methods, resources, daily schedule...</p>
                    </div>
                  )}
                </div>

                {/* Diagnostic Report Preview */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                    onClick={() => setExpandedPreview(expandedPreview === 'diagnostic' ? null : 'diagnostic')}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Diagnostic Assessment (5 pages)</span>
                    </div>
                    {expandedPreview === 'diagnostic' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedPreview === 'diagnostic' && (
                    <div className="p-4 bg-card border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        This report provides the "empirical evidence" that {provinceName} DBE requires, 
                        including learning profile analysis, readiness assessment for {childDisplayName} in {gradeName}, 
                        and recommended instructional strategies tailored to your child's needs.
                      </p>
                      <p className="text-primary text-xs mt-2">+ Full professional analysis included...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* P-Squared Package Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border-[#10B981] border-2 rounded-2xl p-6"
        >
          <div className="space-y-6">
            {/* Price Question */}
            <div className="space-y-3">
              <p className="font-semibold text-center text-lg">
                What would you be comfortable paying for this service?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="py-6 hover:border-[#10B981] hover:bg-[#10B981]/5"
                  onClick={() => handlePriceChoice('R599')}
                  disabled={messageSent}
                >
                  R599
                </Button>
                <Button
                  variant="outline"
                  className="py-6 hover:border-[#10B981] hover:bg-[#10B981]/5"
                  onClick={() => handlePriceChoice('R799')}
                  disabled={messageSent}
                >
                  R799
                </Button>
                <Button
                  variant="outline"
                  className="py-6 hover:border-[#10B981] hover:bg-[#10B981]/5"
                  onClick={() => handlePriceChoice('R999')}
                  disabled={messageSent}
                >
                  R999
                </Button>
                <Button
                  variant="outline"
                  className="py-6 hover:border-[#10B981] hover:bg-[#10B981]/5"
                  onClick={() => handlePriceChoice('R1,299')}
                  disabled={messageSent}
                >
                  R1,299
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full text-sm text-gray-500 hover:text-gray-700"
                onClick={() => handlePriceChoice('Not sure - I have questions')}
                disabled={messageSent}
              >
                Not sure yet - I have questions
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#10B981] hover:bg-[#059669] text-white"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10"
            onClick={() => {
              localStorage.clear();
              navigate('/assessment');
            }}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Take New Assessment
          </Button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Results;
