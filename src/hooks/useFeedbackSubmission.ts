import { useState } from 'react';
import { feedbackAnalysisService, AnalyzedFeedback } from '../services/feedbackAnalysis';
import { analyticsService } from '../services/analyticsService';

export function useFeedbackSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (
    text: string,
    department?: string
  ): Promise<{ success: boolean; feedback?: AnalyzedFeedback; error?: string }> => {
    if (!text.trim()) {
      return { success: false, error: 'Feedback text cannot be empty' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get AI analysis
      const analysis = await feedbackAnalysisService.analyzeFeedback(text, department);

      if (!analysis) {
        throw new Error('Failed to analyze feedback');
      }

      // Create feedback object
      const feedback: AnalyzedFeedback = {
        id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        department: department || 'General',
        timestamp: new Date().toISOString(),
        status: 'submitted',
        anonymous: true,
        analysis
      };

      // Store in localStorage
      analyticsService.addFeedback(feedback);

      setIsSubmitting(false);
      return { success: true, feedback };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(errorMessage);
      setIsSubmitting(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    error
  };
}
