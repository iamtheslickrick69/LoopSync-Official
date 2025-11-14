import { motion } from 'framer-motion';
import { OwnerSidebar } from '../layout/OwnerSidebar';
import { useNavigationStore } from '../../store/navigationStore';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { FeedbackStreamPage } from './pages/FeedbackStreamPage';
import { RiskRadarPage } from './pages/RiskRadarPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { TeamHealthPage } from './pages/TeamHealthPage';
import { SettingsPage } from './pages/SettingsPage';

export function OwnerPortal() {
  const { ownerPage } = useNavigationStore();

  const renderPage = () => {
    switch (ownerPage) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'feedback-stream':
        return <FeedbackStreamPage />;
      case 'risk-radar':
        return <RiskRadarPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'team-health':
        return <TeamHealthPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen theme-red-gradient"
    >
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-executive-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-executive-300/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 27,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <OwnerSidebar />
      <div className="ml-64 relative z-10">
        {renderPage()}
      </div>
    </motion.div>
  );
}
