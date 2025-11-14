import { AnalyzedFeedback } from './feedbackAnalysis';
import { analyticsService } from './analyticsService';

export function seedDemoData(): void {
  const demoFeedback: AnalyzedFeedback[] = [
    {
      id: 'demo-1',
      text: 'The new deployment pipeline is causing severe delays. Three releases failed this week alone.',
      department: 'Engineering',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.7,
        category: 'concern',
        severity: 'high',
        themes: ['deployment', 'technical-debt', 'DevOps'],
        riskFlags: { project: true, retention: false, legal: false, culture: false },
        summary: 'Critical deployment issues impacting Engineering team',
        suggestedResponse: 'Thank you for raising this. We are prioritizing infrastructure improvements and will address the deployment pipeline issues immediately.'
      }
    },
    {
      id: 'demo-2',
      text: 'Loving the new flexible work policy! Being able to work from home 3 days a week has dramatically improved my work-life balance.',
      department: 'Marketing',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      anonymous: true,
      analysis: {
        sentiment: 'positive',
        sentimentScore: 0.9,
        category: 'celebration',
        severity: 'low',
        themes: ['work-life-balance', 'policy', 'flexibility'],
        riskFlags: { project: false, retention: false, legal: false, culture: false },
        summary: 'Positive feedback on flexible work policy',
        suggestedResponse: 'We are thrilled this policy is working well for you! Your work-life balance is important to us.'
      }
    },
    {
      id: 'demo-3',
      text: 'Communication between product and engineering is breaking down. We built an entire feature last sprint that product now says is not what they wanted.',
      department: 'Engineering',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in-progress',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.6,
        category: 'concern',
        severity: 'medium',
        themes: ['communication', 'product', 'collaboration'],
        riskFlags: { project: true, retention: false, legal: false, culture: true },
        summary: 'Cross-team communication issues causing waste',
        suggestedResponse: 'This is concerning. Let us schedule a product-engineering sync to align on requirements and improve our collaboration process.'
      }
    },
    {
      id: 'demo-4',
      text: 'Big shoutout to Sarah for mentoring me through my first major project! Her guidance on code review best practices was invaluable.',
      department: 'Engineering',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      anonymous: false,
      analysis: {
        sentiment: 'positive',
        sentimentScore: 1.0,
        category: 'celebration',
        severity: 'low',
        themes: ['mentorship', 'collaboration', 'professional-development'],
        riskFlags: { project: false, retention: false, legal: false, culture: false },
        summary: 'Positive mentorship experience',
        suggestedResponse: 'Thank you for sharing this! We love seeing team members support each other. Sarah, great work!'
      }
    },
    {
      id: 'demo-5',
      text: 'Our customer support tickets are piling up because the team is understaffed. Response times have doubled in the last month.',
      department: 'Operations',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.5,
        category: 'concern',
        severity: 'high',
        themes: ['staffing', 'workload', 'customer-service'],
        riskFlags: { project: false, retention: true, legal: false, culture: false },
        summary: 'Support team understaffing causing delays',
        suggestedResponse: 'We acknowledge the staffing challenge. HR is actively recruiting and we are exploring interim solutions to reduce the backlog.'
      }
    },
    {
      id: 'demo-6',
      text: 'Career growth feels stagnant. Been in the same role for 2 years with no clear path forward.',
      department: 'Engineering',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.7,
        category: 'concern',
        severity: 'high',
        themes: ['career-development', 'promotion', 'growth'],
        riskFlags: { project: false, retention: true, legal: false, culture: false },
        summary: 'Employee feels career stagnation',
        suggestedResponse: 'Thank you for sharing this. Let us schedule time to discuss your career goals and create a clear growth plan together.'
      }
    },
    {
      id: 'demo-7',
      text: 'There\'s concerning behavior from a senior team member that makes people uncomfortable. Multiple people have witnessed inappropriate comments.',
      department: 'Sales',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in-progress',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -1.0,
        category: 'concern',
        severity: 'critical',
        themes: ['workplace-conduct', 'HR', 'culture'],
        riskFlags: { project: false, retention: false, legal: true, culture: true },
        summary: 'Serious workplace conduct issue requiring immediate HR attention',
        suggestedResponse: 'This is a serious concern. HR will investigate immediately. Your safety and comfort are our top priority. Please contact HR directly if you need support.'
      }
    },
    {
      id: 'demo-8',
      text: 'The Q3 all-hands was fantastic! Finally feel like I understand where the company is headed.',
      department: 'Marketing',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      anonymous: true,
      analysis: {
        sentiment: 'positive',
        sentimentScore: 0.8,
        category: 'celebration',
        severity: 'low',
        themes: ['communication', 'leadership', 'transparency'],
        riskFlags: { project: false, retention: false, legal: false, culture: false },
        summary: 'Positive feedback on company communication',
        suggestedResponse: 'We are so glad you found the all-hands valuable! Transparent communication is a priority for us.'
      }
    },
    {
      id: 'demo-9',
      text: 'Can we get standing desks or desk converters? Sitting all day is killing my back.',
      department: 'Design',
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in-progress',
      anonymous: true,
      analysis: {
        sentiment: 'neutral',
        sentimentScore: 0,
        category: 'suggestion',
        severity: 'medium',
        themes: ['wellness', 'office', 'ergonomics'],
        riskFlags: { project: false, retention: false, legal: false, culture: false },
        summary: 'Request for ergonomic office equipment',
        suggestedResponse: 'Thank you for this suggestion. We are evaluating ergonomic equipment options and will share an update soon.'
      }
    },
    {
      id: 'demo-10',
      text: 'The constant context switching is burning people out. I\'m on 4 different projects simultaneously.',
      department: 'Engineering',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.8,
        category: 'concern',
        severity: 'high',
        themes: ['workload', 'burnout', 'focus'],
        riskFlags: { project: true, retention: true, legal: false, culture: false },
        summary: 'Excessive context switching causing burnout',
        suggestedResponse: 'This is critical feedback. We will review project allocations and work to reduce context switching across the team.'
      }
    },
    {
      id: 'demo-11',
      text: 'Just wanted to say the new parental leave policy is amazing. It means the world to my family.',
      department: 'Operations',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      anonymous: false,
      analysis: {
        sentiment: 'positive',
        sentimentScore: 1.0,
        category: 'celebration',
        severity: 'low',
        themes: ['benefits', 'policy', 'work-life-balance'],
        riskFlags: { project: false, retention: false, legal: false, culture: false },
        summary: 'Appreciation for parental leave policy',
        suggestedResponse: 'We are so happy to support you and your family! Congratulations and best wishes.'
      }
    },
    {
      id: 'demo-12',
      text: 'Sales commission structure changed mid-quarter without communication. This directly impacts our compensation.',
      department: 'Sales',
      timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      anonymous: true,
      analysis: {
        sentiment: 'negative',
        sentimentScore: -0.9,
        category: 'concern',
        severity: 'high',
        themes: ['compensation', 'communication', 'transparency'],
        riskFlags: { project: false, retention: true, legal: false, culture: true },
        summary: 'Commission structure change communicated poorly',
        suggestedResponse: 'We apologize for the lack of communication. Leadership will clarify the changes and provide a clear explanation immediately.'
      }
    }
  ];

  analyticsService.saveFeedbackData(demoFeedback);
  console.log('Demo data seeded successfully!');
}

export function clearDemoData(): void {
  analyticsService.saveFeedbackData([]);
  console.log('Demo data cleared');
}

export function hasFeedbackData(): boolean {
  return analyticsService.getFeedbackData().length > 0;
}
