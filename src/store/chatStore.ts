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
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  submitConversationAsFeedback: (messageIds?: string[], department?: string) => Promise<boolean>;
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

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  },

  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [], error: null }),

  submitConversationAsFeedback: async (messageIds?: string[], department?: string) => {
    const { messages } = get();

    // Extract user messages to create feedback text
    let userMessages = messages.filter(m => m.role === 'user');

    // If specific message IDs provided, filter to only those
    if (messageIds && messageIds.length > 0) {
      userMessages = userMessages.filter(m => messageIds.includes(m.id));
    }

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
        status: 'unread' as const,
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
