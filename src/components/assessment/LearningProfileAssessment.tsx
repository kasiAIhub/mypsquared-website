import { useState, useEffect } from 'react';
import AssessmentIntake from './AssessmentIntake';
import LearningProfileQuestionComponent from './LearningProfileQuestion';
import ProfileReport from './ProfileReport';
import { IntakeData, LearningProfileAnswer, LearningProfileData } from '@/types/learningProfile';
import { learningProfileQuestions } from '@/lib/learningProfileQuestions';
import { generateProfileAnalysis } from '@/lib/learningProfileAnalysis';
import { saveAssessmentToDatabase } from '@/lib/saveAssessmentToDb';
import { toast } from 'sonner';

type AssessmentStage = 'intake' | 'questions' | 'report';

const STORAGE_KEY = 'learningProfileData';

interface LearningProfileAssessmentProps {
  onComplete?: () => void;
}

export default function LearningProfileAssessment({ onComplete }: LearningProfileAssessmentProps) {
  const [stage, setStage] = useState<AssessmentStage>('intake');
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [answers, setAnswers] = useState<LearningProfileAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: LearningProfileData = JSON.parse(saved);
        setIntakeData(data.intakeData);
        setAnswers(data.answers);
        if (data.answers.length === learningProfileQuestions.length) {
          setStage('report');
        } else if (data.answers.length > 0) {
          setStage('questions');
          setCurrentQuestionIndex(data.answers.length);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (stage !== 'questions') return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [stage, currentQuestionIndex]);

  const saveToLocalStorage = (data: Partial<LearningProfileData>) => {
    const fullData: LearningProfileData = {
      intakeData: data.intakeData || intakeData!,
      answers: data.answers || answers,
      completedAt: data.completedAt || new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
  };

  const handleIntakeComplete = (data: IntakeData) => {
    setIntakeData(data);
    saveToLocalStorage({ intakeData: data, answers: [], completedAt: new Date().toISOString() });
    setStage('questions');
  };

  const handleAnswer = (answer: LearningProfileAnswer) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }

    setAnswers(newAnswers);
    saveToLocalStorage({ intakeData: intakeData!, answers: newAnswers, completedAt: new Date().toISOString() });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < learningProfileQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalData: LearningProfileData = {
        intakeData: intakeData!,
        answers,
        completedAt: new Date().toISOString()
      };
      saveToLocalStorage(finalData);

      // Save to database
      try {
        const assessmentId = await saveAssessmentToDatabase(finalData);
        if (assessmentId) {
          localStorage.setItem('psquared_assessment_id', assessmentId);
        }
      } catch {
        console.error('Failed to save to database');
      }

      setStage('report');
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStage('intake');
    setIntakeData(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  if (stage === 'intake') {
    return <AssessmentIntake onComplete={handleIntakeComplete} />;
  }

  if (stage === 'questions') {
    const safeIndex = Math.min(
      Math.max(currentQuestionIndex, 0),
      learningProfileQuestions.length - 1
    );
    const currentQuestion = learningProfileQuestions[safeIndex];
    if (!currentQuestion) {
      return null;
    }
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

    return (
      <LearningProfileQuestionComponent
        question={currentQuestion}
        answer={currentAnswer}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={learningProfileQuestions.length}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === learningProfileQuestions.length - 1}
      />
    );
  }

  if (stage === 'report' && intakeData) {
    const profileData: LearningProfileData = {
      intakeData,
      answers,
      completedAt: new Date().toISOString()
    };

    const analysis = generateProfileAnalysis(profileData);

    return (
      <ProfileReport
        profileData={profileData}
        analysis={analysis}
        onStartOver={handleStartOver}
      />
    );
  }

  return null;
}
