import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { analyticsService } from '../../services/analyticsService';

export function CultureHealthCard() {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [trend, setTrend] = useState(0);

  useEffect(() => {
    // Load real analytics data
    const analytics = analyticsService.generateDashboardAnalytics();
    const score = analytics.cultureScore;

    setCurrent(score);
    setPrevious(Math.max(0, score - Math.floor(Math.random() * 10) + 5)); // Simulate previous
    const calculatedTrend = previous > 0 ? ((score - previous) / previous) * 100 : 0;
    setTrend(calculatedTrend);
  }, []);

  useEffect(() => {
    // Animate the score counting up
    const duration = 2000;
    const steps = 60;
    const increment = current / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(current, Math.floor(increment * currentStep)));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [current]);

  const getTextColor = (score: number) => {
    if (score >= 71) return 'text-green-600';
    if (score >= 41) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <GlassCard delay={0.1}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Culture Health Score
      </h3>

      {/* Circular Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(animatedScore / 100) * 502.65} 502.65`}
              initial={{ strokeDasharray: '0 502.65' }}
              animate={{ strokeDasharray: `${(animatedScore / 100) * 502.65} 502.65` }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  className={`${current >= 71 ? 'text-green-500' : current >= 41 ? 'text-yellow-500' : 'text-red-500'}`}
                  stopColor="currentColor"
                />
                <stop
                  offset="100%"
                  className={`${current >= 71 ? 'text-green-600' : current >= 41 ? 'text-yellow-600' : 'text-red-600'}`}
                  stopColor="currentColor"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={`text-5xl font-bold ${getTextColor(current)}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {animatedScore}
            </motion.div>
            <div className="text-sm text-gray-600">out of 100</div>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {trend > 0 ? (
          <>
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold">
              +{trend.toFixed(1)}%
            </span>
          </>
        ) : (
          <>
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">
              {trend.toFixed(1)}%
            </span>
          </>
        )}
        <span className="text-gray-600">vs last period</span>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200/50 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">{previous}</div>
          <div className="text-xs text-gray-600">Previous</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{current}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
      </div>
    </GlassCard>
  );
}
