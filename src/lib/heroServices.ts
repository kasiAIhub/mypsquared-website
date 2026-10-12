export interface HeroService {
  id: number;
  image: string;
  hint: string;
  serviceName: string;
  tagline: string;
  features: string[];
  ctaPrimary: string;
  ctaLink: string;
  ctaSecondary?: string;
  ctaSecondaryLink?: string;
}

export const heroServices: HeroService[] = [
  {
    id: 1,
    image: "/4d68ff31-dc58-4005-b823-615fd7cd35eb.jpg",
    hint: "DBE Registration",
    serviceName: "DBE Registration Service",
    tagline: "The decision becomes official",
    features: [
      "Official homeschool registration (Grade 1-12)",
      "All grades: Primary & High School supported",
      "Document preparation & submission",
      "Legal compliance guidance",
      "R599-R1,299 packages",
    ],
    ctaPrimary: "Start Your Registration",
    ctaLink: "/assessment",
    ctaSecondary: "Learn more",
    ctaSecondaryLink: "#registration"
  },
  {
    id: 2,
    image: "/1a67a51f-0df8-4133-9e26-f380227ea3dd.jpg",
    hint: "My Learning Coach",
    serviceName: "My Learning Coach",
    tagline: "Your calm daily guide for the first 7 days",
    features: [
      "Step-by-step guidance for your first week",
      "Built around your child's learner profile",
      "Designed for the parent, not the child",
      "Set up your learning space, rhythm, and records",
      "Connect with other families",
      "Coming soon — join the waitlist"
    ],
    ctaPrimary: "Join the Waitlist",
    ctaLink: "/my-learning-coach",
    ctaSecondary: "Learn more",
    ctaSecondaryLink: "/my-learning-coach"
  },
  {
    id: 3,
    image: "/1fecb879-6e19-4fd4-a301-b59d2f869bc3.jpg",
    hint: "Curriculum Advisory",
    serviceName: "Curriculum Advisory",
    tagline: "The path that fits your child",
    features: [
      "Cambridge, CAPS, IEB guidance",
      "Subject combination planning",
      "Grade 1-12 transition support",
      "Curriculum matching to child's strengths",
      "Long-term academic planning"
    ],
    ctaPrimary: "Join the Learner Blueprint Waitlist",
    ctaLink: "/waitlist",

    ctaSecondary: "Explore options",
    ctaSecondaryLink: "#curriculum"
  },
  {
    id: 4,
    image: "/3b5a36d0-de3e-4be4-8366-3157d329b3f5.jpg",
    hint: "Online School Options",
    serviceName: "Online School Partnerships",
    tagline: "Vetted options, honest comparisons",
    features: [
      "Vetted online school directory",
      "Platform comparisons & reviews",
      "Cost breakdowns (Grade 1-12)",
      "Quality assessments",
      "Partner schools (ad space available)",
      "Find your perfect fit"
    ],
    ctaPrimary: "Explore Online Schools",
    ctaLink: "/assessment",
    ctaSecondary: "Compare schools",
    ctaSecondaryLink: "#schools"
  },
  {
    id: 5,
    image: "/4ed7e8f9-8cc7-4b78-839f-854fce3c76a4.jpg",
    hint: "Assessment & Placement",
    serviceName: "Assessment & Placement",
    tagline: "Discover your child's learning archetype in 5 minutes. 20+ profiles matched to how they actually think and learn.",
    features: [
      "Builds your child's learner profile",
      "20+ learning archetypes",
      "Strength mapping",
      "Grade 1-12 appropriate testing",
      "Custom learning roadmap"
    ],
    ctaPrimary: "Book Assessment",
    ctaLink: "/assessment",
    ctaSecondary: "How it works",
    ctaSecondaryLink: "#assessment"
  },
  {
    id: 6,
    image: "/9ea86cde-aa55-428e-a2fa-ff65574a9292.jpg",
    hint: "Personalised Learning",
    serviceName: "Personalised Learning",
    tagline: "One guide, infinite adaptations",
    features: [
      "Personalised to each child's learning pattern",
      "Simultaneous support (Grade 1-12)",
      "Adapts to each interaction",
      "Adjusts difficulty in real-time",
      "Celebrates unique strengths"
    ],
    ctaPrimary: "Start Assessment",
    ctaLink: "/assessment",
    ctaSecondary: "Learn more",
    ctaSecondaryLink: "/my-learning-coach"
  },
  {
    id: 7,
    image: "/6f540fa7-23c0-4596-ab13-a0f229b93239.jpg",
    hint: "Support Centres Near You",
    serviceName: "Support Centers Network",
    tagline: "You're not alone",
    features: [
      "Physical hubs across South Africa",
      "Community connection points",
      "Resource libraries",
      "Parent meetups (Grade 1-12 families)",
      "Mentorship programs"
    ],
    ctaPrimary: "Find Your Center",
    ctaLink: "/assessment",
    ctaSecondary: "See locations",
    ctaSecondaryLink: "#centers"
  },
  {
    id: 8,
    image: "/78635147-25af-4c85-affd-b9183b64e3a0.jpg",
    hint: "Extramural Activities",
    serviceName: "Extramural Activities",
    tagline: "Beyond academics",
    features: [
      "Sports clubs directory",
      "Arts programs",
      "Social groups (Grade 1-12)",
      "Field trips",
      "Life skills workshops"
    ],
    ctaPrimary: "Browse Activities",
    ctaLink: "/assessment",
    ctaSecondary: "Explore more",
    ctaSecondaryLink: "#activities"
  },
  {
    id: 9,
    image: "/1fecb879-6e19-4fd4-a301-b59d2f869bc3.jpg",
    hint: "Education Equity Promise",
    serviceName: "Education Equity Guarantee",
    tagline: "Same standards, everywhere",
    features: [
      "Same curriculum, any postcode",
      "Quality regardless of income",
      "Township, suburban, rural access",
      "Grade 1-12, all contexts",
      "Education as a right"
    ],
    ctaPrimary: "Our Promise",
    ctaLink: "/assessment",
    ctaSecondary: "Read more",
    ctaSecondaryLink: "#equity"
  },
  {
    id: 10,
    image: "/4d68ff31-dc58-4005-b823-615fd7cd35eb.jpg",
    hint: "School-to-Home Transition",
    serviceName: "Transition Support",
    tagline: "Smooth handoff from school to home",
    features: [
      "School exit guidance (any grade)",
      "Emotional transition coaching",
      "First 90 days support",
      "Parent onboarding (Grade 1-12)",
      "Child adjustment resources"
    ],
    ctaPrimary: "Plan Your Transition",
    ctaLink: "/assessment",
    ctaSecondary: "Get started",
    ctaSecondaryLink: "#transition"
  },
  {
    id: 11,
    image: "/167446b9-3ec6-4636-af5b-abf8ca45fcb4.jpg",
    hint: "Personalised Education",
    serviceName: "Personalised Education",
    tagline: "Your child as the constant",
    features: [
      "Personalised guidance",
      "Adaptive curriculum (Grade 1-12)",
      "Real-time progress tracking",
      "Predictive learning paths",
      "Voice-first support",
      "Einstein made light the constant. We made you the constant."
    ],
    ctaPrimary: "Enter the Future",
    ctaLink: "/assessment",
    ctaSecondary: "Learn how",
    ctaSecondaryLink: "/my-learning-coach"
  },
  {
    id: 12,
    image: "/9ea86cde-aa55-428e-a2fa-ff65574a9292.jpg",
    hint: "Parent Community",
    serviceName: "Parent Community",
    tagline: "You're the constant now",
    features: [
      "Private parent forums",
      "Expert workshops",
      "Legal updates",
      "Curriculum sharing (Grade 1-12)",
      "Success stories",
      "Weekly coaching calls"
    ],
    ctaPrimary: "Join the Community",
    ctaLink: "/assessment",
    ctaSecondary: "Explore community",
    ctaSecondaryLink: "#community"
  }
];
