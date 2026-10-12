import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionWrapper from "@/components/assessment/QuestionWrapper";
import Q1_DocumentChecklist from "@/components/assessment/questions/Q1_DocumentChecklist";
import Q2_Timeline from "@/components/assessment/questions/Q2_Timeline";
import Q3_Qualifications from "@/components/assessment/questions/Q3_Qualifications";
import Q4_Experience from "@/components/assessment/questions/Q4_Experience";
import Q5_Reason from "@/components/assessment/questions/Q5_Reason";
import Q6_Evidence from "@/components/assessment/questions/Q6_Evidence";
import Q7_Concerns from "@/components/assessment/questions/Q7_Concerns";
import Q8_IdealPackage from "@/components/assessment/questions/Q8_IdealPackage";
import Q9_Province from "@/components/assessment/questions/Q9_Province";
import Q10_ChildInfo from "@/components/assessment/questions/Q10_ChildInfo";
import Q11_EmailCapture from "@/components/assessment/questions/Q11_EmailCapture";
import { AssessmentAnswers, initialAssessmentAnswers } from "@/types/assessment";
import { calculateScore } from "@/lib/scoringLogic";
import { saveAssessmentLead } from "@/hooks/useAssessmentLead";
import Footer from "@/components/layout/Footer";

const TOTAL_QUESTIONS = 11;

const Assessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>(() => {
    const isNewAssessment = searchParams.get('new') === 'true';
    if (isNewAssessment) {
      // Clear all assessment-related data for fresh start
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('psquared_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return initialAssessmentAnswers;
    }
    const saved = localStorage.getItem('psquared_assessment');
    return saved ? JSON.parse(saved) : initialAssessmentAnswers;
  });

  useEffect(() => {
    // Clear previous results when starting/continuing assessment
    // This ensures fresh priority numbers and reservation status for each new completion
    localStorage.removeItem('psquared_score');
    localStorage.removeItem('psquared_lead_id');
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentQuestion]);

  useEffect(() => {
    localStorage.setItem('psquared_assessment', JSON.stringify(answers));
  }, [answers]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isQuestionValid = (questionNum: number): boolean => {
    switch (questionNum) {
      case 1:
        return answers.documents.noneOfThese || 
          Object.entries(answers.documents)
            .filter(([key]) => key !== 'noneOfThese')
            .some(([, value]) => value);
      case 2:
        return answers.timeline !== '';
      case 3:
        return answers.qualification !== '';
      case 4:
        return answers.experience !== '';
      case 5:
        return answers.reasons.length >= 1 && answers.reasons.length <= 3;
      case 6:
        return answers.evidenceTypes.length >= 1;
      case 7:
        return true; // Optional
      case 8:
        return true; // Optional
      case 9:
        return answers.province !== '';
      case 10:
        return answers.grade !== '' && answers.currentSituation !== '' && (answers.childName?.trim().length || 0) > 0;
      case 11:
        return (answers.firstName?.trim().length || 0) > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and save results
      const score = calculateScore(answers);
      localStorage.setItem('psquared_score', JSON.stringify(score));
      localStorage.setItem('psquared_assessment', JSON.stringify(answers));

      // Save to database
      const leadResult = await saveAssessmentLead({ answers, score });
      if (leadResult) {
        localStorage.setItem('psquared_lead_id', leadResult.id);
      }

      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getQuestionConfig = (questionNum: number) => {
    switch (questionNum) {
      case 1:
        return {
          title: "Which documents do you already have?",
          helpText: "DBE requires specific documents for your application. Check what you have ready and we'll guide you on the rest.",
        };
      case 2:
        return {
          title: "When do you plan to submit your application?",
          helpText: "Provincial DBE offices aim to respond within 30 days. Submitting early reduces backlogs.",
        };
      case 3:
        return {
          title: "What is your highest educational qualification?",
          helpText: "Recent DBE Clarifications: Teaching qualifications are NOT required. We'll frame ANY background as relevant.",
          tipText: "Even 'No formal qualification' gets approved. We frame life experience as teaching capability.",
        };
      case 4:
        return {
          title: "What best describes your work experience?",
        };
      case 5:
        return {
          title: "What are your reasons for home education?",
          helpText: "Select 1-3 reasons that best describe your situation. Multiple reasons strengthen your application.",
        };
      case 6:
        return {
          title: "What evidence can support your motivation?",
          helpText: "Select all types of evidence you have or can obtain. More evidence strengthens your case.",
        };
      case 7:
        return {
          title: "What are your biggest concerns about the DBE application?",
        };
      case 8:
        return {
          title: "What would your ideal application package include?",
        };
      case 9:
        return {
          title: "Which province will you apply to?",
        };
      case 10:
        return {
          title: "Tell us about your child",
        };
      case 11:
        return {
          title: "What should we call you?",
        };
      default:
        return { title: "" };
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <Q1_DocumentChecklist
            value={answers.documents}
            onChange={(documents) => setAnswers({ ...answers, documents })}
          />
        );
      case 2:
        return (
          <Q2_Timeline
            value={answers.timeline}
            onChange={(timeline) => setAnswers({ ...answers, timeline })}
          />
        );
      case 3:
        return (
          <Q3_Qualifications
            value={answers.qualification}
            onChange={(qualification) => setAnswers({ ...answers, qualification })}
          />
        );
      case 4:
        return (
          <Q4_Experience
            value={{ experience: answers.experience, experienceField: answers.experienceField }}
            onChange={({ experience, experienceField }) => setAnswers({ ...answers, experience, experienceField })}
          />
        );
      case 5:
        return (
          <Q5_Reason
            value={answers.reasons}
            onChange={(reasons) => setAnswers({ ...answers, reasons })}
          />
        );
      case 6:
        return (
          <Q6_Evidence
            value={answers.evidenceTypes}
            onChange={(evidenceTypes) => setAnswers({ ...answers, evidenceTypes })}
          />
        );
      case 7:
        return (
          <Q7_Concerns
            value={answers.concerns}
            onChange={(concerns) => setAnswers({ ...answers, concerns })}
          />
        );
      case 8:
        return (
          <Q8_IdealPackage
            value={answers.idealPackage}
            onChange={(idealPackage) => setAnswers({ ...answers, idealPackage })}
          />
        );
      case 9:
        return (
          <Q9_Province
            value={answers.province}
            onChange={(province) => setAnswers({ ...answers, province })}
          />
        );
      case 10:
        return (
          <Q10_ChildInfo
            value={{ grade: answers.grade, childName: answers.childName, currentSituation: answers.currentSituation }}
            onChange={({ grade, childName, currentSituation }) => setAnswers({ ...answers, grade, childName, currentSituation })}
          />
        );
      case 11:
        return (
          <Q11_EmailCapture
            value={{
              email: answers.email,
              phone: answers.phone || '',
              firstName: answers.firstName,
              optInPriorityList: answers.optInPriorityList,
              optInGuide: answers.optInGuide,
              optInUpdates: answers.optInUpdates,
            }}
            onChange={(data) => setAnswers({ ...answers, ...data })}
          />
        );
      default:
        return null;
    }
  };

  const config = getQuestionConfig(currentQuestion);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to Home Button */}
      {currentQuestion === 1 && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      )}

      <div className="flex-1">
        <QuestionWrapper
          currentQuestion={currentQuestion}
          totalQuestions={TOTAL_QUESTIONS}
          title={config.title}
          helpText={config.helpText}
          tipText={config.tipText}
          isValid={isQuestionValid(currentQuestion)}
          onBack={currentQuestion > 1 ? handleBack : undefined}
          onNext={handleNext}
          nextLabel={currentQuestion === TOTAL_QUESTIONS ? "See My Results" : "Next"}
        >
          {renderQuestion()}
        </QuestionWrapper>
      </div>

      <Footer />
    </div>
  );
};

export default Assessment;
