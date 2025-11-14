export type MessageRole = 'user' | 'assistant' | 'draft';

export interface DraftMetadata {
  privacyLevel: 'anonymous' | 'group' | 'department' | 'identified';
  urgency: 'general' | 'priority' | 'critical';
  tags: string[];
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  draftMetadata?: DraftMetadata;
  approved?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
}

export interface ClaudeConfig {
  apiKey: string | null;
  model: string;
  maxTokens: number;
}
