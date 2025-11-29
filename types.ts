export interface EventDetails {
  eventName: string;
  context: string;
  groupSize: string;
  matchingRules: string;
  mandatoryTopics: string;
  matchingPhilosophy: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'choice' | 'boolean';
  options?: string[]; // For choice type
}

export interface Participant {
  id: string;
  name: string;
  answers: Record<string, string>; // questionId -> answer
}

export interface GroupMember {
  id: string;
  name: string;
  role?: string;
  strengths?: string[];
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  justification: string;
  strengths: string[];
  risks: string[];
  compatibilityScore: number;
}

export type AppStep = 'setup' | 'questionnaire' | 'collection' | 'grouping' | 'results';

export interface AppState {
  step: AppStep;
  eventDetails: EventDetails;
  questions: Question[];
  participants: Participant[];
  groups: Group[];
  isLoading: boolean;
  error: string | null;
}
