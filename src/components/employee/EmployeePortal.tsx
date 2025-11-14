import { motion } from 'framer-motion';
import { EmployeeSidebar } from '../layout/EmployeeSidebar';
import { useNavigationStore } from '../../store/navigationStore';
import { EmployeeHome } from './pages/EmployeeHome';
import { MyFeedback } from './pages/MyFeedback';
import { TeamPulse } from './pages/TeamPulse';
import { HelpResources } from './pages/HelpResources';

export function EmployeePortal() {
  const { employeePage } = useNavigationStore();

  const renderPage = () => {
    switch (employeePage) {
      case 'home':
        return <EmployeeHome />;
      case 'my-feedback':
        return <MyFeedback />;
      case 'team-pulse':
        return <TeamPulse />;
      case 'help':
        return <HelpResources />;
      default:
        return <EmployeeHome />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen theme-yellow-gradient"
    >
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <EmployeeSidebar />
      <div className="ml-64 relative z-10">
        {renderPage()}
      </div>
    </motion.div>
  );
}
