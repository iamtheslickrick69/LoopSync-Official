import { create } from 'zustand';
import { Feedback, FeedbackFilters } from '../types/feedback';
import { mockFeedback } from '../utils/mockData';

interface FeedbackStore {
  feedback: Feedback[];
  filters: FeedbackFilters;

  setFilters: (filters: Partial<FeedbackFilters>) => void;
  clearFilters: () => void;
  getFilteredFeedback: () => Feedback[];
  updateFeedbackStatus: (id: string, status: Feedback['status']) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  feedback: mockFeedback,
  filters: {},

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => set({ filters: {} }),

  getFilteredFeedback: () => {
    const { feedback, filters } = get();

    let filtered = [...feedback];

    // Filter by urgency
    if (filters.urgency && filters.urgency.length > 0) {
      filtered = filtered.filter((f) => filters.urgency!.includes(f.urgency));
    }

    // Filter by department
    if (filters.department && filters.department.length > 0) {
      filtered = filtered.filter(
        (f) => f.department && filters.department!.includes(f.department)
      );
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((f) => filters.status!.includes(f.status));
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter(
        (f) =>
          f.timestamp >= filters.dateRange!.start &&
          f.timestamp <= filters.dateRange!.end
      );
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.content.toLowerCase().includes(query) ||
          f.tags.some((t) => t.value.toLowerCase().includes(query))
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return filtered;
  },

  updateFeedbackStatus: (id, status) => {
    set((state) => ({
      feedback: state.feedback.map((f) =>
        f.id === id ? { ...f, status } : f
      ),
    }));
  },

  addFeedback: (feedbackData) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    set((state) => ({
      feedback: [newFeedback, ...state.feedback],
    }));
  },
}));
