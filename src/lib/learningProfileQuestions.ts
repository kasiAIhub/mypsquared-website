import { LearningProfileQuestion } from '@/types/learningProfile';

export const learningProfileQuestions: LearningProfileQuestion[] = [
  {
    id: 'q1',
    question: 'How does your child learn best?',
    category: 'learning_style',
    type: 'multiple',
    options: [
      { value: 'visual', label: 'By seeing (diagrams, videos, reading)' },
      { value: 'auditory', label: 'By listening (discussions, audio, lectures)' },
      { value: 'kinesthetic', label: 'By doing (hands-on activities, experiments)' },
      { value: 'reading', label: 'By reading and writing' },
      { value: 'social', label: 'By working with others' }
    ]
  },
  {
    id: 'q2',
    question: 'What is your child\'s preferred pace of learning?',
    category: 'learning_style',
    type: 'single',
    options: [
      { value: 'fast', label: 'Faster than peers - gets bored easily', score: 3 },
      { value: 'average', label: 'Similar to peers - comfortable pace', score: 2 },
      { value: 'slow', label: 'Slower than peers - needs more time', score: 1 },
      { value: 'varies', label: 'Varies by subject', score: 2 }
    ]
  },
  {
    id: 'q3',
    question: 'How independent is your child with schoolwork?',
    category: 'learning_style',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Needs constant support',
    maxLabel: 'Completely self-directed'
  },
  {
    id: 'q4',
    question: 'Which subjects does your child excel in?',
    category: 'academic',
    type: 'multiple',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'language', label: 'Languages (English, Afrikaans)' },
      { value: 'science', label: 'Natural Sciences' },
      { value: 'creative', label: 'Creative Arts' },
      { value: 'social', label: 'Social Sciences' },
      { value: 'technology', label: 'Technology' },
      { value: 'physical', label: 'Physical Education' }
    ]
  },
  {
    id: 'q5',
    question: 'Which subjects does your child struggle with?',
    category: 'academic',
    type: 'multiple',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'language', label: 'Languages (English, Afrikaans)' },
      { value: 'science', label: 'Natural Sciences' },
      { value: 'creative', label: 'Creative Arts' },
      { value: 'social', label: 'Social Sciences' },
      { value: 'technology', label: 'Technology' },
      { value: 'none', label: 'No significant struggles' }
    ]
  },
  {
    id: 'q6',
    question: 'How would you rate your child\'s current academic performance?',
    category: 'academic',
    type: 'single',
    options: [
      { value: 'excellent', label: 'Excellent (80-100%) - Top of class', score: 5 },
      { value: 'good', label: 'Good (70-79%) - Above average', score: 4 },
      { value: 'average', label: 'Average (60-69%) - Meeting expectations', score: 3 },
      { value: 'below', label: 'Below Average (50-59%) - Needs support', score: 2 },
      { value: 'struggling', label: 'Struggling (Below 50%) - Significant challenges', score: 1 }
    ]
  },
  {
    id: 'q7',
    question: 'Does your child have any diagnosed learning differences or special needs?',
    category: 'challenges',
    type: 'multiple',
    options: [
      { value: 'adhd', label: 'ADHD' },
      { value: 'autism', label: 'Autism Spectrum' },
      { value: 'dyslexia', label: 'Dyslexia' },
      { value: 'dyscalculia', label: 'Dyscalculia' },
      { value: 'anxiety', label: 'Anxiety' },
      { value: 'gifted', label: 'Gifted/Advanced' },
      { value: 'other', label: 'Other (please specify in notes)' },
      { value: 'none', label: 'None' }
    ]
  },
  {
    id: 'q8',
    question: 'How does your child interact with peers?',
    category: 'social',
    type: 'single',
    options: [
      { value: 'very_social', label: 'Very social - thrives in groups', score: 5 },
      { value: 'social', label: 'Social - enjoys peer interaction', score: 4 },
      { value: 'selective', label: 'Selective - prefers small groups', score: 3 },
      { value: 'shy', label: 'Shy - takes time to warm up', score: 2 },
      { value: 'struggles', label: 'Struggles with peer relationships', score: 1 }
    ]
  },
  {
    id: 'q9',
    question: 'How important is social interaction in your child\'s school day?',
    category: 'social',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Not important - prefers independent work',
    maxLabel: 'Very important - needs daily peer contact'
  },
  {
    id: 'q10',
    question: 'What are your child\'s main interests and hobbies?',
    category: 'interests',
    type: 'multiple',
    options: [
      { value: 'sports', label: 'Sports and physical activities' },
      { value: 'arts', label: 'Arts and crafts' },
      { value: 'music', label: 'Music' },
      { value: 'reading', label: 'Reading and literature' },
      { value: 'stem', label: 'Science, technology, engineering' },
      { value: 'gaming', label: 'Gaming and digital media' },
      { value: 'nature', label: 'Nature and outdoors' },
      { value: 'building', label: 'Building and making things' }
    ]
  },
  {
    id: 'q11',
    question: 'How well does your child handle frustration and setbacks?',
    category: 'social',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Gets very upset, gives up easily',
    maxLabel: 'Resilient, perseveres through challenges'
  },
  {
    id: 'q12',
    question: 'What time of day is your child most alert and focused?',
    category: 'learning_style',
    type: 'single',
    options: [
      { value: 'morning', label: 'Morning (7am-11am)' },
      { value: 'midday', label: 'Midday (11am-2pm)' },
      { value: 'afternoon', label: 'Afternoon (2pm-5pm)' },
      { value: 'evening', label: 'Evening (5pm-8pm)' },
      { value: 'consistent', label: 'Consistent throughout day' }
    ]
  },
  {
    id: 'q13',
    question: 'How does your child respond to structure and routine?',
    category: 'learning_style',
    type: 'single',
    options: [
      { value: 'needs_high', label: 'Needs high structure - thrives on routine', score: 5 },
      { value: 'prefers', label: 'Prefers structure but can be flexible', score: 4 },
      { value: 'moderate', label: 'Moderate - some routine helps', score: 3 },
      { value: 'flexible', label: 'Very flexible - adapts easily', score: 2 },
      { value: 'resists', label: 'Resists structure - prefers freedom', score: 1 }
    ]
  },
  {
    id: 'q14',
    question: 'What are your primary goals for your child\'s education?',
    category: 'interests',
    type: 'multiple',
    options: [
      { value: 'academic', label: 'Strong academic achievement' },
      { value: 'confidence', label: 'Build confidence and self-esteem' },
      { value: 'social', label: 'Develop social skills' },
      { value: 'independence', label: 'Foster independence and self-direction' },
      { value: 'creativity', label: 'Nurture creativity and innovation' },
      { value: 'values', label: 'Align with family values' },
      { value: 'wellbeing', label: 'Prioritize mental health and wellbeing' }
    ]
  },
];
