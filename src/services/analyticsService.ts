import { AnalyzedFeedback } from './feedbackAnalysis';
import { SentimentDataPoint, DepartmentMetrics, RiskIndicator, AIInsight } from '../types/analytics';
import { claudeService } from './claudeAPI';

export interface DashboardAnalytics {
  cultureScore: number; // 0-100
  totalFeedback: number;
  sentimentTimeline: SentimentDataPoint[];
  riskCounts: { critical: number; high: number; medium: number; low: number };
  departmentBreakdown: Record<string, { count: number; avgSentiment: number }>;
}

export interface RiskRadarData {
  retention: {
    count: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    feedbackItems: string[];
    description: string;
  };
  legal: {
    count: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    feedbackItems: string[];
    description: string;
  };
  project: {
    count: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    feedbackItems: string[];
    description: string;
  };
  culture: {
    count: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    feedbackItems: string[];
    description: string;
  };
}

class AnalyticsService {
  private readonly FEEDBACK_STORAGE_KEY = 'loopsync-feedback';

  getFeedbackData(): AnalyzedFeedback[] {
    try {
      const data = localStorage.getItem(this.FEEDBACK_STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed || [];
    } catch (error) {
      console.error('Failed to read feedback data:', error);
      return [];
    }
  }

  saveFeedbackData(feedback: AnalyzedFeedback[]): void {
    try {
      localStorage.setItem(this.FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
    } catch (error) {
      console.error('Failed to save feedback data:', error);
    }
  }

  addFeedback(feedback: AnalyzedFeedback): void {
    const existing = this.getFeedbackData();
    existing.push(feedback);
    this.saveFeedbackData(existing);
  }

  updateFeedbackStatus(id: string, status: AnalyzedFeedback['status']): void {
    const existing = this.getFeedbackData();
    const updated = existing.map(f => f.id === id ? { ...f, status } : f);
    this.saveFeedbackData(updated);
  }

  generateDashboardAnalytics(): DashboardAnalytics {
    const feedbackData = this.getFeedbackData();

    if (feedbackData.length === 0) {
      return {
        cultureScore: 0,
        totalFeedback: 0,
        sentimentTimeline: [],
        riskCounts: { critical: 0, high: 0, medium: 0, low: 0 },
        departmentBreakdown: {}
      };
    }

    // Calculate culture health score (0-100)
    const avgSentiment = feedbackData.reduce((acc, f) => acc + f.analysis.sentimentScore, 0) / feedbackData.length;
    const cultureScore = Math.round(((avgSentiment + 1) / 2) * 100); // Convert -1 to 1 → 0 to 100

    // Generate sentiment timeline (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentFeedback = feedbackData.filter(f => new Date(f.timestamp) > thirtyDaysAgo);

    // Group by date
    const timelineData: Record<string, { overall: number[]; byDept: Record<string, number[]> }> = {};

    recentFeedback.forEach(f => {
      const date = new Date(f.timestamp).toLocaleDateString('en-US');
      if (!timelineData[date]) {
        timelineData[date] = { overall: [], byDept: {} };
      }
      timelineData[date].overall.push(f.analysis.sentimentScore);

      if (f.department) {
        if (!timelineData[date].byDept[f.department]) {
          timelineData[date].byDept[f.department] = [];
        }
        timelineData[date].byDept[f.department].push(f.analysis.sentimentScore);
      }
    });

    const sentimentTimeline: SentimentDataPoint[] = Object.entries(timelineData)
      .map(([date, data]) => {
        const avg = (scores: number[]) => scores.reduce((a, b) => a + b, 0) / scores.length;

        return {
          date,
          overall: avg(data.overall),
          engineering: data.byDept['Engineering'] ? avg(data.byDept['Engineering']) : 0,
          sales: data.byDept['Sales'] ? avg(data.byDept['Sales']) : 0,
          marketing: data.byDept['Marketing'] ? avg(data.byDept['Marketing']) : 0,
          operations: data.byDept['Operations'] ? avg(data.byDept['Operations']) : 0,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Count risks by severity
    const riskCounts = feedbackData.reduce(
      (acc, f) => {
        acc[f.analysis.severity] = (acc[f.analysis.severity] || 0) + 1;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 }
    );

    // Department breakdown
    const departmentBreakdown: Record<string, { count: number; avgSentiment: number }> = {};

    feedbackData.forEach(f => {
      const dept = f.department || 'General';
      if (!departmentBreakdown[dept]) {
        departmentBreakdown[dept] = { count: 0, avgSentiment: 0 };
      }
      departmentBreakdown[dept].count++;
    });

    // Calculate avg sentiment per department
    Object.keys(departmentBreakdown).forEach(dept => {
      const deptFeedback = feedbackData.filter(f => (f.department || 'General') === dept);
      const avgSent = deptFeedback.reduce((acc, f) => acc + f.analysis.sentimentScore, 0) / deptFeedback.length;
      departmentBreakdown[dept].avgSentiment = avgSent;
    });

    return {
      cultureScore,
      totalFeedback: feedbackData.length,
      sentimentTimeline,
      riskCounts,
      departmentBreakdown
    };
  }

  generateRiskRadar(): RiskRadarData {
    const feedbackData = this.getFeedbackData();

    const risks: RiskRadarData = {
      retention: {
        count: 0,
        severity: 'low',
        feedbackItems: [],
        description: ''
      },
      legal: {
        count: 0,
        severity: 'low',
        feedbackItems: [],
        description: ''
      },
      project: {
        count: 0,
        severity: 'low',
        feedbackItems: [],
        description: ''
      },
      culture: {
        count: 0,
        severity: 'low',
        feedbackItems: [],
        description: ''
      }
    };

    feedbackData.forEach(f => {
      // Check each risk flag
      const riskTypes = ['retention', 'legal', 'project', 'culture'] as const;

      riskTypes.forEach(riskType => {
        if (f.analysis.riskFlags[riskType]) {
          risks[riskType].count++;
          risks[riskType].feedbackItems.push(f.id);
        }
      });
    });

    // Update severity based on count
    Object.keys(risks).forEach(riskType => {
      const risk = risks[riskType as keyof RiskRadarData];
      if (risk.count >= 5) risk.severity = 'critical';
      else if (risk.count >= 3) risk.severity = 'high';
      else if (risk.count >= 1) risk.severity = 'medium';
      else risk.severity = 'low';
    });

    // Generate descriptions
    risks.retention.description = `${risks.retention.count} employee${risks.retention.count !== 1 ? 's' : ''} mentioned career stagnation, compensation concerns, or burnout`;
    risks.legal.description = `${risks.legal.count} report${risks.legal.count !== 1 ? 's' : ''} of workplace conduct issues requiring HR attention`;
    risks.project.description = `${risks.project.count} mention${risks.project.count !== 1 ? 's' : ''} of technical debt, deployment issues, or delivery concerns`;
    risks.culture.description = `${risks.culture.count} report${risks.culture.count !== 1 ? 's' : ''} of toxic behavior, communication breakdown, or team dysfunction`;

    return risks;
  }

  async generateAIInsights(): Promise<AIInsight[]> {
    const feedbackData = this.getFeedbackData();

    if (!claudeService.isInitialized()) {
      console.warn('Claude API not initialized, skipping insights generation');
      return [];
    }

    if (feedbackData.length < 5) {
      return []; // Need minimum data for insights
    }

    // Prepare feedback summary for Claude (last 20 items)
    const feedbackSummary = feedbackData.slice(-20).map(f => ({
      text: f.text,
      sentiment: f.analysis.sentiment,
      severity: f.analysis.severity,
      department: f.department,
      themes: f.analysis.themes
    }));

    const systemPrompt = `You are Coro, an AI workplace analyst. Analyze recent feedback and generate 3-5 key insights for leadership. Return JSON:

{
  "insights": [
    {
      "title": "Brief headline (e.g., 'Engineering Morale Crisis Developing')",
      "severity": "high" | "medium" | "low",
      "description": "2-3 sentence explanation with data points",
      "affectedDepartment": "Department name or 'Company-wide'",
      "supportingEvidence": "X employees mentioned Y, sentiment dropped Z%",
      "recommendation": "Specific action leadership should take",
      "trend": "increasing" | "stable" | "decreasing"
    }
  ]
}

Focus on: retention risks, cultural issues, project health, communication breakdowns, policy impacts.
Generate insights that are actionable and specific, not generic platitudes.
IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`;

    try {
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
          max_tokens: 2000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Analyze this feedback data and generate insights:\n${JSON.stringify(feedbackSummary, null, 2)}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const insightsText = data.content[0].text;
      const cleanJson = insightsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Map to AIInsight type
      return parsed.insights.map((insight: any) => ({
        type: this.mapSeverityToType(insight.severity),
        title: insight.title,
        description: `${insight.description}\n\nEvidence: ${insight.supportingEvidence}\n\nRecommendation: ${insight.recommendation}`,
        impact: insight.severity,
        relatedFeedbackIds: feedbackData.slice(-5).map(f => f.id) // Use recent feedback IDs
      }));
    } catch (error) {
      console.error('Insights generation failed:', error);
      return [];
    }
  }

  private mapSeverityToType(severity: string): AIInsight['type'] {
    switch (severity) {
      case 'high': return 'critical';
      case 'medium': return 'trending-down';
      case 'low': return 'hidden';
      default: return 'action-required';
    }
  }

  getDepartmentMetrics(): DepartmentMetrics[] {
    const feedbackData = this.getFeedbackData();
    const departments = ['Engineering', 'Sales', 'Marketing', 'Operations', 'Design'];

    return departments.map(dept => {
      const deptFeedback = feedbackData.filter(f => f.department === dept);

      if (deptFeedback.length === 0) {
        return {
          department: dept,
          participationRate: 0,
          averageSentiment: 0,
          responseTime: 0,
          feedbackCount: 0
        };
      }

      const avgSentiment = deptFeedback.reduce((acc, f) => acc + f.analysis.sentimentScore, 0) / deptFeedback.length;

      // Calculate avg response time for acknowledged/resolved items
      const resolvedFeedback = deptFeedback.filter(f => f.status !== 'submitted');
      const avgResponseTime = resolvedFeedback.length > 0
        ? resolvedFeedback.reduce((acc, f) => {
            const created = new Date(f.timestamp).getTime();
            const now = Date.now();
            return acc + ((now - created) / (1000 * 60 * 60)); // hours
          }, 0) / resolvedFeedback.length
        : 0;

      return {
        department: dept,
        participationRate: Math.min(100, (deptFeedback.length / feedbackData.length) * 100),
        averageSentiment: avgSentiment,
        responseTime: Math.round(avgResponseTime),
        feedbackCount: deptFeedback.length
      };
    });
  }
}

export const analyticsService = new AnalyticsService();
