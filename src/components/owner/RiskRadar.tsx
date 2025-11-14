import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../shared/GlassCard';
import { analyticsService } from '../../services/analyticsService';

export function RiskRadar() {
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    const riskData = analyticsService.generateRiskRadar();

    // Convert to array format for rendering
    const riskArray = [
      {
        category: 'Retention Risk',
        level: riskData.retention.severity,
        metric: Math.min(100, riskData.retention.count * 15), // Scale for visualization
        trend: riskData.retention.count > 3 ? 'up' : riskData.retention.count > 0 ? 'stable' : 'down',
        description: riskData.retention.description
      },
      {
        category: 'Legal Exposure',
        level: riskData.legal.severity,
        metric: Math.min(100, riskData.legal.count * 25),
        trend: riskData.legal.count > 2 ? 'up' : riskData.legal.count > 0 ? 'stable' : 'down',
        description: riskData.legal.description
      },
      {
        category: 'Project Health',
        level: riskData.project.severity,
        metric: Math.min(100, riskData.project.count * 15),
        trend: riskData.project.count > 3 ? 'up' : riskData.project.count > 0 ? 'stable' : 'down',
        description: riskData.project.description
      },
      {
        category: 'Culture Breakdown',
        level: riskData.culture.severity,
        metric: Math.min(100, riskData.culture.count * 20),
        trend: riskData.culture.count > 2 ? 'up' : riskData.culture.count > 0 ? 'stable' : 'down',
        description: riskData.culture.description
      }
    ];

    setRisks(riskArray);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'from-red-500 to-red-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <GlassCard delay={0.5}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Risk Radar
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.category}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-subtle rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getRiskIcon(risk.level)}</span>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {risk.category}
                </h4>
              </div>
              {getTrendIcon(risk.trend)}
            </div>

            <p className="text-xs text-gray-600 mb-3">{risk.description}</p>

            {/* Metric Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getRiskColor(risk.level)}`}
                initial={{ width: 0 }}
                animate={{ width: `${risk.metric}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
            <div className="mt-1 text-right text-xs font-medium text-gray-700">
              {risk.metric}
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
