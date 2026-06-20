// ─── Benefit Category Types ───

export type BenefitCategory =
  | "food"
  | "health"
  | "housing"
  | "family"
  | "unemployment"
  | "utilities"
  | "education"
  | "transport";

export interface CategoryStyle {
  border: string;
  dot: string;
  label: string;
  emoji: string;
}

export const categoryColors: Record<BenefitCategory, CategoryStyle> = {
  food: { border: "#166534", dot: "#166534", label: "Food & Nutrition", emoji: "🍎" },
  health: { border: "#1D4ED8", dot: "#1D4ED8", label: "Healthcare", emoji: "🏥" },
  housing: { border: "#C2410C", dot: "#C2410C", label: "Housing & Rent", emoji: "🏠" },
  family: { border: "#6D28D9", dot: "#6D28D9", label: "Child & Family", emoji: "👶" },
  unemployment: { border: "#B45309", dot: "#B45309", label: "Unemployment & Jobs", emoji: "💼" },
  utilities: { border: "#CA8A04", dot: "#CA8A04", label: "Utilities & Bills", emoji: "⚡" },
  education: { border: "#7C3AED", dot: "#7C3AED", label: "Education & Training", emoji: "🎓" },
  transport: { border: "#0F766E", dot: "#0F766E", label: "Transportation", emoji: "🚌" },
};

// ─── Category Info (for browse/grid) ───

export interface CategoryInfo {
  id: BenefitCategory;
  name: string;
  emoji: string;
  programSlugs: string[];
  accentColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "food",
    name: "Food & Nutrition",
    emoji: "🍎",
    programSlugs: ["snap", "wic", "school-meals", "food-banks"],
    accentColor: "#166534",
  },
  {
    id: "housing",
    name: "Housing & Rent",
    emoji: "🏠",
    programSlugs: ["section-8", "emergency-rental-assistance", "hud-housing"],
    accentColor: "#C2410C",
  },
  {
    id: "health",
    name: "Healthcare",
    emoji: "🏥",
    programSlugs: ["medicaid", "chip", "aca-marketplace", "medicare-savings"],
    accentColor: "#1D4ED8",
  },
  {
    id: "education",
    name: "Education & Training",
    emoji: "🎓",
    programSlugs: ["pell-grant", "wioa-job-training", "head-start", "adult-education"],
    accentColor: "#7C3AED",
  },
  {
    id: "transport",
    name: "Transportation",
    emoji: "🚌",
    programSlugs: ["medicaid-transport", "reduced-fare-transit"],
    accentColor: "#0F766E",
  },
  {
    id: "family",
    name: "Child & Family",
    emoji: "👶",
    programSlugs: ["tanf", "ccap-childcare", "wic", "head-start"],
    accentColor: "#6D28D9",
  },
  {
    id: "unemployment",
    name: "Unemployment & Jobs",
    emoji: "💼",
    programSlugs: ["unemployment-insurance", "wioa-job-training", "job-corps"],
    accentColor: "#B45309",
  },
  {
    id: "utilities",
    name: "Utilities & Bills",
    emoji: "⚡",
    programSlugs: ["liheap", "lifeline-phone", "acp-internet"],
    accentColor: "#CA8A04",
  },
];

// ─── Program Data Types ───

export interface IncomeLimit {
  household_size: number;
  gross_monthly: number;
  net_monthly: number;
}

export interface ProgramEligibility {
  income_limits: IncomeLimit[];
  citizenship_required: boolean;
  age_range?: { min?: number; max?: number };
  requires_children: boolean;
  requires_disability: boolean;
  requires_employment_history: boolean;
  special_notes: string[];
}

export interface ProgramBenefit {
  type: string;
  average_amount?: string;
  duration: string;
}

export interface ProgramApplication {
  apply_url: string;
  apply_phone?: string;
  can_apply_online: boolean;
  requires_interview: boolean;
  decision_timeline: string;
  expedited_available: boolean;
  expedited_timeline?: string;
}

export interface ProgramStep {
  step_number: number;
  title: string;
  description: string;
  tips?: string[];
  time_estimate: string;
  action_url?: string;
  action_label?: string;
}

export interface ProgramFAQ {
  question: string;
  answer: string;
}

export interface Program {
  slug: string;
  name: string;
  full_name: string;
  category: BenefitCategory;
  summary: string;
  federal_or_state: "federal" | "state" | "both";
  eligibility: ProgramEligibility;
  benefit: ProgramBenefit;
  application: ProgramApplication;
  documents_needed: string[];
  steps: ProgramStep[];
  faqs: ProgramFAQ[];
  can_combine_with: string[];
  source_url: string;
  last_updated: string;
}

// ─── Chat / Conversational AI Types ───

export type QuestionType = "text" | "pills" | "yesno" | "number" | "multiselect" | "dropdown";
export type TopicKey = "income" | "family" | "housing" | "health" | "location" | "other";

export interface QuestionCard {
  question: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  required: boolean;
  topic: TopicKey;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  question?: QuestionCard;
  timestamp: number;
}

export interface UserSummary {
  state: string;
  income_range: string;
  household_size: number;
  has_children: boolean;
  children_ages?: number[];
  employment_status: string;
  housing_status: string;
  has_health_insurance: boolean;
  other_flags: string[];
}

export interface ChatApiRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  situation: string;
  topics_covered: string[];
}

export interface ChatApiResponse {
  message: string;
  question: QuestionCard | null;
  topics_covered: string[];
  ready_for_results: boolean;
  summary?: UserSummary;
}

// ─── Program Matching Types ───

export interface ProgramMatch {
  slug: string;
  program_name: string;
  category: BenefitCategory;
  reasoning: string;
  confidence: "likely" | "possible" | "borderline";
  apply_url: string;
  source: string;
}

export interface ProgramsApiRequest {
  summary: UserSummary;
  category_filter?: string;
}

export interface ProgramsApiResponse {
  qualifying: ProgramMatch[];
  not_qualifying: { slug: string; program_name: string; category: BenefitCategory; reasoning: string }[];
}

// ─── Legacy compat (BenefitCard) ───

export interface BenefitCardProps {
  program: string;
  slug?: string;
  category: BenefitCategory;
  reasoning: string;
  confidence: "likely" | "possible" | "borderline";
  apply_url: string;
  source: string;
  qualifies: boolean;
}

// ─── UI Component Props ───

export interface PillSelectorProps {
  options: { label: string; value: string }[];
  selected: string | null;
  onChange: (value: string) => void;
}

export interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
  totalSteps: number;
}

// ─── Quick Topic Type ───

export interface QuickTopic {
  label: string;
  situation: string;
}

export const quickTopics: QuickTopic[] = [
  {
    label: "I lost my job",
    situation: "I recently lost my job and need help with expenses",
  },
  {
    label: "I have young children",
    situation: "I have young children and need help with food and childcare costs",
  },
  {
    label: "I'm facing eviction",
    situation: "I can't pay my rent and may be evicted soon",
  },
  {
    label: "I have a disability",
    situation: "I have a disability and need help with income and healthcare",
  },
  {
    label: "I'm a senior citizen",
    situation: "I am a senior citizen on a fixed income",
  },
  {
    label: "I'm pregnant",
    situation: "I'm pregnant and need help with healthcare and food costs",
  },
  {
    label: "I need help with education",
    situation: "I need financial help to go back to school or get job training",
  },
];

// ─── US States ───

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia",
];

export type IncomeRange =
  | "under_1000"
  | "1000_2500"
  | "2500_4000"
  | "over_4000";

export const INCOME_OPTIONS: { label: string; value: IncomeRange }[] = [
  { label: "Under $1,000", value: "under_1000" },
  { label: "$1,000 – $2,500", value: "1000_2500" },
  { label: "$2,500 – $4,000", value: "2500_4000" },
  { label: "Over $4,000", value: "over_4000" },
];
