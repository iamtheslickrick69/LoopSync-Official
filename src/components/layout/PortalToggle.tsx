import { motion } from 'framer-motion';
import { usePortalStore } from '../../store/portalStore';
import { Users, Briefcase } from 'lucide-react';

export function PortalToggle() {
  const { currentPortal, togglePortal, isTransitioning } = usePortalStore();

  return (
    <div className="fixed top-24 right-8 z-40">
      <div className="glass-strong rounded-full p-1.5 flex items-center gap-1 shadow-glass-lg">
        <button
          onClick={togglePortal}
          disabled={isTransitioning}
          className={`relative px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            currentPortal === 'employee'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
          }`}
        >
          {currentPortal === 'employee' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-purple rounded-full shadow-glow"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Users className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Employee</span>
        </button>

        <button
          onClick={togglePortal}
          disabled={isTransitioning}
          className={`relative px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            currentPortal === 'owner'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
          }`}
        >
          {currentPortal === 'owner' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-secondary-500 via-secondary-600 to-accent-cyan rounded-full shadow-glow-cyan"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Briefcase className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Owner</span>
        </button>
      </div>
    </div>
  );
}
