import { create } from 'zustand';
import { Feedback, FeedbackFilters } from '../types/feedback';
import { analyticsService } from '../services/analyticsService';
import { AnalyzedFeedback } from '../services/feedbackAnalysis';

interface FeedbackStore {
  filters: FeedbackFilters;

  setFilters: (filters: Partial<FeedbackFilters>) => void;
  clearFilters: () => void;
  getFilteredFeedback: () => AnalyzedFeedback[];
  updateFeedbackStatus: (id: string, status: AnalyzedFeedback['status']) => void;
  getAllFeedback: () => AnalyzedFeedback[];
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  filters: {},

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => set({ filters: {} }),

  getAllFeedback: () => {
    return analyticsService.getFeedbackData();
  },

  getFilteredFeedback: () => {
    const { filters } = get();
    let feedback = analyticsService.getFeedbackData();

    // Filter by department
    if (filters.department && filters.department.length > 0) {
      feedback = feedback.filter(
        (f) => f.department && filters.department!.includes(f.department)
      );
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      feedback = feedback.filter((f) => filters.status!.includes(f.status));
    }

    // Filter by date range
    if (filters.dateRange) {
      feedback = feedback.filter(
        (f) => {
          const timestamp = new Date(f.timestamp);
          return timestamp >= filters.dateRange!.start &&
            timestamp <= filters.dateRange!.end;
        }
      );
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      feedback = feedback.filter(
        (f) =>
          f.text.toLowerCase().includes(query) ||
          f.analysis.themes.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort by timestamp (newest first)
    feedback.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return feedback;
  },

  updateFeedbackStatus: (id, status) => {
    analyticsService.updateFeedbackStatus(id, status);
    // Trigger re-render by updating filters (hacky but works with zustand)
    set((state) => ({ filters: { ...state.filters } }));
  },
}));
