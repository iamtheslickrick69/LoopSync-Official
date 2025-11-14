export type PrivacyLevel = 'anonymous' | 'group' | 'department' | 'identified';
export type UrgencyLevel = 'general' | 'priority' | 'critical';
export type FeedbackStatus = 'submitted' | 'unread' | 'acknowledged' | 'in-progress' | 'resolved';
export type SentimentScore = -1 | -0.5 | 0 | 0.5 | 1;

export interface Tag {
  type: 'person' | 'project' | 'department' | 'topic';
  value: string;
}

export interface Feedback {
  id: string;
  timestamp: Date;
  privacyLevel: PrivacyLevel;
  urgency: UrgencyLevel;
  content: string;
  sentiment: SentimentScore;
  tags: Tag[];
  status: FeedbackStatus;
  department?: string;
  employeeId?: string; // Only for non-anonymous
}

export interface FeedbackFilters {
  urgency?: UrgencyLevel[];
  department?: string[];
  dateRange?: { start: Date; end: Date };
  status?: FeedbackStatus[];
  searchQuery?: string;
}
