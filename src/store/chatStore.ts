import { create } from 'zustand';
import { Message } from '../types/chat';
import { feedbackAnalysisService } from '../services/feedbackAnalysis';
import { analyticsService } from '../services/analyticsService';

interface ChatStore {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  isSubmittingFeedback: boolean;

  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  submitConversationAsFeedback: (department?: string) => Promise<boolean>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  error: null,
  isSubmittingFeedback: false,

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [], error: null }),

  submitConversationAsFeedback: async (department?: string) => {
    const { messages } = get();

    // Extract user messages to create feedback text
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      set({ error: 'No messages to submit as feedback' });
      return false;
    }

    const feedbackText = userMessages.map(m => m.content).join(' | ');

    set({ isSubmittingFeedback: true, error: null });

    try {
      const analysis = await feedbackAnalysisService.analyzeFeedback(feedbackText, department);

      if (!analysis) {
        throw new Error('Failed to analyze feedback');
      }

      const feedback = {
        id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: feedbackText,
        department: department || 'General',
        timestamp: new Date().toISOString(),
        status: 'submitted' as const,
        anonymous: true,
        analysis
      };

      analyticsService.addFeedback(feedback);

      set({ isSubmittingFeedback: false });
      return true;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to submit feedback',
        isSubmittingFeedback: false
      });
      return false;
    }
  }
}));
