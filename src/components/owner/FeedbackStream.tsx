import { useState } from 'react';
import { Search, Filter, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../shared/GlassCard';
import { Badge } from '../shared/Badge';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useFeedbackStore } from '../../store/feedbackStore';

export function FeedbackStream() {
  const { getFilteredFeedback, setFilters, filters, updateFeedbackStatus } = useFeedbackStore();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const feedback = getFilteredFeedback().slice(0, 10); // Show recent 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'default' as const;
      case 'acknowledged':
        return 'info' as const;
      case 'in-progress':
        return 'warning' as const;
      case 'resolved':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <GlassCard delay={0.4} className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Feedback Stream</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/90 transition-all flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-4 glass-subtle rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search feedback..."
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="flex-1"
            />
          </div>
        </motion.div>
      )}

      {/* Feedback List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {feedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-subtle rounded-xl p-4 hover:bg-white/70 transition-all cursor-pointer"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getSeverityIcon(item.analysis.severity)}</span>
                <Badge variant={getStatusColor(item.status)} size="sm">
                  {item.status}
                </Badge>
                <span className={`text-xs font-medium ${getSentimentColor(item.analysis.sentiment)}`}>
                  {item.analysis.sentiment}
                </span>
                {item.department && (
                  <span className="text-xs text-gray-600">
                    {item.department}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>

            {/* Content */}
            <p className={`text-sm text-gray-700 ${expandedId === item.id ? '' : 'line-clamp-2'}`}>
              {item.text}
            </p>

            {/* AI Summary (when expanded) */}
            {expandedId === item.id && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs font-semibold text-blue-900 mb-1">AI Summary</div>
                <p className="text-xs text-blue-800">{item.analysis.summary}</p>
              </div>
            )}

            {/* Themes */}
            {item.analysis.themes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {item.analysis.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons (when expanded) */}
            {expandedId === item.id && (
              <div className="mt-3 flex gap-2">
                {item.status === 'submitted' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFeedbackStatus(item.id, 'acknowledged');
                    }}
                  >
                    Acknowledge
                  </Button>
                )}
                {item.status === 'acknowledged' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFeedbackStatus(item.id, 'in-progress');
                    }}
                  >
                    Start Working
                  </Button>
                )}
                {item.status === 'in-progress' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFeedbackStatus(item.id, 'resolved');
                    }}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
