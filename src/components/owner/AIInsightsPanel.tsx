import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, TrendingUp, TrendingDown, Eye, Zap, RefreshCw } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { analyticsService } from '../../services/analyticsService';
import { AIInsight } from '../../types/analytics';

export function AIInsightsPanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const generatedInsights = await analyticsService.generateAIInsights();
      setInsights(generatedInsights.length > 0 ? generatedInsights : getPlaceholderInsights());
    } catch (error) {
      console.error('Failed to load insights:', error);
      setInsights(getPlaceholderInsights());
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderInsights = (): AIInsight[] => {
    const feedbackData = analyticsService.getFeedbackData();
    if (feedbackData.length === 0) {
      return [{
        type: 'hidden',
        title: 'No Feedback Data Yet',
        description: 'Start collecting feedback to see AI-powered insights here. Add your Claude API key in Settings to enable real-time analysis.',
        impact: 'low',
        relatedFeedbackIds: []
      }];
    }

    return [{
      type: 'action-required',
      title: 'Connect Claude API for AI Insights',
      description: 'Add your Claude API key in Settings to unlock AI-powered insights that analyze patterns, risks, and trends in your feedback data.',
      impact: 'medium',
      relatedFeedbackIds: []
    }];
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5" />;
      case 'trending-down':
        return <TrendingDown className="w-5 h-5" />;
      case 'hidden':
        return <Eye className="w-5 h-5" />;
      case 'action-required':
        return <Zap className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'trending-up':
        return 'text-green-600';
      case 'trending-down':
        return 'text-orange-600';
      case 'hidden':
        return 'text-purple-600';
      case 'action-required':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      default:
        return 'info' as const;
    }
  };

  return (
    <GlassCard delay={0.2}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Powered Insights
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {insights.length > 0 ? `${insights.length}-point` : ''} daily digest powered by Coro AI
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={loadInsights}
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-subtle rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 flex items-start gap-3 hover:bg-white/50 transition-colors text-left"
            >
              <div className={`mt-0.5 ${getColor(insight.type)}`}>
                {getIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {insight.title}
                  </h4>
                  <Badge variant={getBadgeVariant(insight.impact)} size="sm">
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {insight.description}
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pl-12">
                    <p className="text-sm text-gray-700 mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📊 Related feedback:</span>
                      <span className="font-medium">
                        {insight.relatedFeedbackIds.length} items
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
