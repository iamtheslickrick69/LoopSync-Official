import { claudeService } from './claudeAPI';

export interface FeedbackAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  category: 'concern' | 'suggestion' | 'celebration' | 'question';
  severity: 'critical' | 'high' | 'medium' | 'low';
  themes: string[];
  riskFlags: {
    retention: boolean;
    legal: boolean;
    culture: boolean;
    project: boolean;
  };
  summary: string;
  suggestedResponse: string;
}

export interface AnalyzedFeedback {
  id: string;
  text: string;
  department: string;
  timestamp: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
  anonymous: boolean;
  analysis: FeedbackAnalysis;
}

class FeedbackAnalysisService {
  private apiCallCount = 0;

  getApiCallCount(): number {
    return this.apiCallCount;
  }

  resetApiCallCount(): void {
    this.apiCallCount = 0;
  }

  async analyzeFeedback(feedbackText: string, department?: string): Promise<FeedbackAnalysis | null> {
    if (!claudeService.isInitialized()) {
      throw new Error('Claude API not initialized. Please set your API key in settings.');
    }

    const systemPrompt = `You are Coro, an AI assistant analyzing workplace feedback for patterns, sentiment, and risk. Analyze the following employee feedback and return a JSON object with:

{
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": -1 to 1 (float, where -1 is very negative, 0 is neutral, 1 is very positive),
  "category": "concern" | "suggestion" | "celebration" | "question",
  "severity": "critical" | "high" | "medium" | "low",
  "themes": ["theme1", "theme2", "theme3"] (2-4 specific themes mentioned),
  "riskFlags": {
    "retention": boolean (career growth, compensation, burnout, leaving mentions),
    "legal": boolean (harassment, discrimination, safety, policy violations),
    "culture": boolean (toxic behavior, team dysfunction, communication breakdown),
    "project": boolean (technical debt, delivery issues, product problems)
  },
  "summary": "One sentence summary of the core issue or message",
  "suggestedResponse": "Empathetic 2-3 sentence leadership response template"
}

Severity guidelines:
- critical: Immediate action required (legal issues, safety, mass resignation risk)
- high: Urgent attention needed (retention risk, project blockers, morale crisis)
- medium: Important but not urgent (process improvements, team friction)
- low: General feedback (suggestions, minor concerns, celebrations)

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no explanation.`;

    try {
      this.apiCallCount++;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': localStorage.getItem('loopsync-settings')
            ? JSON.parse(localStorage.getItem('loopsync-settings')!).state.claudeApiKey
            : '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Analyze this workplace feedback${department ? ` from ${department} department` : ''}: "${feedbackText}"`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.content[0].text;

      // Strip markdown formatting if present
      const cleanJson = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const analysis = JSON.parse(cleanJson);

      // Validate the analysis structure
      if (!this.isValidAnalysis(analysis)) {
        console.error('Invalid analysis structure:', analysis);
        return this.getFallbackAnalysis(feedbackText);
      }

      return analysis;
    } catch (error) {
      console.error('Feedback analysis failed:', error);

      // Return fallback analysis instead of null
      return this.getFallbackAnalysis(feedbackText);
    }
  }

  private isValidAnalysis(analysis: any): analysis is FeedbackAnalysis {
    return (
      analysis &&
      typeof analysis === 'object' &&
      ['positive', 'neutral', 'negative'].includes(analysis.sentiment) &&
      typeof analysis.sentimentScore === 'number' &&
      ['concern', 'suggestion', 'celebration', 'question'].includes(analysis.category) &&
      ['critical', 'high', 'medium', 'low'].includes(analysis.severity) &&
      Array.isArray(analysis.themes) &&
      typeof analysis.riskFlags === 'object' &&
      typeof analysis.summary === 'string' &&
      typeof analysis.suggestedResponse === 'string'
    );
  }

  private getFallbackAnalysis(feedbackText: string): FeedbackAnalysis {
    // Simple keyword-based fallback
    const text = feedbackText.toLowerCase();

    // Determine sentiment
    const positiveWords = ['great', 'love', 'excellent', 'amazing', 'fantastic', 'happy', 'thank', 'appreciate'];
    const negativeWords = ['issue', 'problem', 'concern', 'broken', 'frustrat', 'bad', 'terrible', 'fail'];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let sentimentScore = 0;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      sentimentScore = 0.6;
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      sentimentScore = -0.6;
    }

    // Determine category
    let category: FeedbackAnalysis['category'] = 'suggestion';
    if (text.includes('?') || text.includes('question')) category = 'question';
    else if (sentiment === 'positive') category = 'celebration';
    else if (sentiment === 'negative') category = 'concern';

    return {
      sentiment,
      sentimentScore,
      category,
      severity: 'medium',
      themes: ['general-feedback'],
      riskFlags: {
        retention: text.includes('quit') || text.includes('leaving') || text.includes('burnout'),
        legal: text.includes('harassment') || text.includes('discriminat'),
        culture: text.includes('toxic') || text.includes('dysfunct'),
        project: text.includes('deploy') || text.includes('bug') || text.includes('technical')
      },
      summary: feedbackText.substring(0, 100) + (feedbackText.length > 100 ? '...' : ''),
      suggestedResponse: 'Thank you for sharing this feedback. We take all employee input seriously and will review this carefully.'
    };
  }
}

export const feedbackAnalysisService = new FeedbackAnalysisService();
