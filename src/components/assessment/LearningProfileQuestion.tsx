import { useState } from 'react';
import { LearningProfileQuestion, LearningProfileAnswer, GoalsAnswer } from '@/types/learningProfile';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface LearningProfileQuestionProps {
  question: LearningProfileQuestion;
  answer: LearningProfileAnswer | undefined;
  onAnswer: (answer: LearningProfileAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
  questionNumber: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
}

export default function LearningProfileQuestionComponent({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  isFirst,
  isLast
}: LearningProfileQuestionProps) {

  const handleSingleChoice = (value: string) => {
    onAnswer({ questionId: question.id, answer: value });
  };

  const handleMultipleChoice = (value: string, checked: boolean) => {
    const currentAnswers = (answer?.answer as string[]) || [];
    const newAnswers = checked
      ? [...currentAnswers, value]
      : currentAnswers.filter(a => a !== value);
    onAnswer({ questionId: question.id, answer: newAnswers, otherText: answer?.otherText });
  };

  const handleMultipleWithOtherText = (text: string) => {
    onAnswer({
      questionId: question.id,
      answer: (answer?.answer as string[]) || [],
      otherText: text.slice(0, 100)
    });
  };

  const handleScale = (value: number[]) => {
    onAnswer({ questionId: question.id, answer: value[0] });
  };

  const handleText = (value: string) => {
    const maxLen = question.maxLength || 1000;
    onAnswer({ questionId: question.id, answer: value.slice(0, maxLen) });
  };

  const handleGoal = (field: keyof GoalsAnswer, value: string) => {
    const current = (answer?.answer as GoalsAnswer) || { goal_1: '', goal_2: '', goal_3: '' };
    onAnswer({
      questionId: question.id,
      answer: { ...current, [field]: value.slice(0, 200) }
    });
  };

  const isAnswered = () => {
    if (!answer) return question.optional === true;
    if (question.optional) return true;
    if (question.type === 'text') return (answer.answer as string).trim().length > 0;
    if (question.type === 'multiple' || question.type === 'multiple_with_other') {
      return Array.isArray(answer.answer) && answer.answer.length > 0;
    }
    if (question.type === 'goals') {
      const goals = answer.answer as GoalsAnswer;
      return goals?.goal_1?.trim() && goals?.goal_2?.trim() && goals?.goal_3?.trim();
    }
    return answer.answer !== undefined && answer.answer !== '';
  };

  const charCount = question.type === 'text' && answer ? (answer.answer as string || '').length : 0;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-[#10B981]">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-[#64748B] capitalize">
            {question.category.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-[#10B981] h-2 rounded-full transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-[#0F172A]">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-[#64748B] mt-1">{question.subtitle}</p>
        )}
        {question.description && (
          <p className="text-[#64748B] mt-3 text-sm leading-relaxed">{question.description}</p>
        )}
      </div>

      <div className="mb-8">
        {/* Single choice */}
        {question.type === 'single' && question.options && (
          <RadioGroup value={answer?.answer as string} onValueChange={handleSingleChoice}>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 border-2 border-[#334155] rounded-lg p-4 hover:border-emerald-500 transition cursor-pointer"
                  onClick={() => handleSingleChoice(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        {/* Multiple choice */}
        {question.type === 'multiple' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 border-2 border-[#334155] rounded-lg p-4 hover:border-emerald-500 transition"
              >
                <Checkbox
                  id={option.value}
                  checked={(answer?.answer as string[] || []).includes(option.value)}
                  onCheckedChange={(checked) => handleMultipleChoice(option.value, checked as boolean)}
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        )}

        {/* Multiple choice with "Other" text input */}
        {question.type === 'multiple_with_other' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 border-2 border-[#334155] rounded-lg p-4 hover:border-emerald-500 transition"
              >
                <Checkbox
                  id={option.value}
                  checked={(answer?.answer as string[] || []).includes(option.value)}
                  onCheckedChange={(checked) => handleMultipleChoice(option.value, checked as boolean)}
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
              </div>
            ))}
            {/* Other option */}
            <div className="flex items-start space-x-3 border-2 border-[#334155] rounded-lg p-4 hover:border-emerald-500 transition">
              <Checkbox
                id="other"
                checked={(answer?.answer as string[] || []).includes('other')}
                onCheckedChange={(checked) => handleMultipleChoice('other', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="other" className="cursor-pointer">Other:</Label>
                {(answer?.answer as string[] || []).includes('other') && (
                  <Input
                    className="mt-2 border-2 border-[#334155] focus:border-emerald-500"
                    value={answer?.otherText || ''}
                    onChange={(e) => handleMultipleWithOtherText(e.target.value)}
                    placeholder="Please specify..."
                    maxLength={100}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scale */}
        {question.type === 'scale' && (
          <div className="py-6">
            <Slider
              value={[answer?.answer as number || question.min || 1]}
              onValueChange={handleScale}
              min={question.min || 1}
              max={question.max || 5}
              step={1}
              className="mb-6"
            />
            <div className="flex justify-between text-sm text-[#64748B]">
              <span>{question.minLabel}</span>
              <span className="font-semibold text-[#10B981] text-lg">
                {answer?.answer as number || question.min || 1}
              </span>
              <span>{question.maxLabel}</span>
            </div>
          </div>
        )}

        {/* Text */}
        {question.type === 'text' && (
          <div className="relative">
            <Textarea
              value={answer?.answer as string || ''}
              onChange={(e) => handleText(e.target.value)}
              placeholder={question.placeholder || 'Share any additional details here...'}
              rows={5}
              maxLength={question.maxLength || 1000}
              className="w-full border-2 border-[#334155] focus:border-emerald-500"
            />
            {question.maxLength && (
              <p className="text-xs text-[#94A3B8] text-right mt-1">
                {charCount}/{question.maxLength}
              </p>
            )}
          </div>
        )}

        {/* Goals (3 text inputs) */}
        {question.type === 'goals' && (
          <div className="space-y-4">
            {(['goal_1', 'goal_2', 'goal_3'] as const).map((field, i) => (
              <div key={field}>
                <Label className="text-sm font-medium text-[#0F172A] mb-1 block">{i + 1}.</Label>
                <Input
                  value={(answer?.answer as GoalsAnswer)?.[field] || ''}
                  onChange={(e) => handleGoal(field, e.target.value)}
                  maxLength={200}
                  className="border-2 border-[#334155] focus:border-emerald-500"
                  placeholder={
                    i === 0 ? '"My child reads for fun"'
                    : i === 1 ? '"They ask deep questions"'
                    : '"They handle mistakes with curiosity"'
                  }
                />
                <p className="text-xs text-[#94A3B8] text-right mt-0.5">
                  {((answer?.answer as GoalsAnswer)?.[field] || '').length}/200
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
          ← Previous
        </Button>

        <div className="flex gap-3">
          {question.optional && (
            <Button
              variant="ghost"
              onClick={onNext}
              className="text-[#64748B]"
            >
              Skip this question
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!isAnswered()}
            className="bg-[#10B981] hover:bg-[#059669]"
          >
            {isLast ? 'Generate Report' : 'Next'} →
          </Button>
        </div>
      </div>
    </div>
  );
}
