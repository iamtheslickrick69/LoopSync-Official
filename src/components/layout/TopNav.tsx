import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Briefcase, User, Home, Sparkles } from 'lucide-react';
import { usePortalStore } from '../../store/portalStore';
import { SettingsModal } from './SettingsModal';
import { AIOrb } from '../shared/AIOrb';

export function TopNav() {
  const { currentPortal, togglePortal, isTransitioning, returnToLanding } = usePortalStore();
  const [showSettings, setShowSettings] = useState(false);

  // Dynamic gradient based on current portal
  const portalGradient = currentPortal === 'employee'
    ? 'from-secondary-500 to-secondary-600'
    : 'from-executive-500 to-executive-600';

  const portalColor = currentPortal === 'employee' ? 'secondary' : 'executive';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-50 glass-ultra border-b border-white/50 sticky top-0 shadow-lg"
      >
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with AI Orb */}
            <div className="flex items-center gap-4">
              <button
                onClick={returnToLanding}
                className="flex items-center gap-3 group"
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 scale-75">
                    <AIOrb size="small" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient-orb group-hover:scale-105 transition-transform">
                    LoopSync
                  </h1>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Powered by Coro AI
                  </p>
                </div>
              </button>

              {/* Back to Home Button */}
              <motion.button
                onClick={returnToLanding}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:glass-hover transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                  Home
                </span>
              </motion.button>
            </div>

            {/* Center - Role Toggle */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="glass-strong rounded-full p-1.5 flex items-center gap-1 shadow-xl">
                <motion.button
                  onClick={togglePortal}
                  disabled={isTransitioning}
                  className={`relative px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    currentPortal === 'employee'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={currentPortal !== 'employee' ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentPortal === 'employee' && (
                    <motion.div
                      layoutId="activePortal"
                      className={`absolute inset-0 bg-gradient-to-r ${portalGradient} rounded-full shadow-lg`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Users className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Employee</span>
                </motion.button>

                <motion.button
                  onClick={togglePortal}
                  disabled={isTransitioning}
                  className={`relative px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    currentPortal === 'owner'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={currentPortal !== 'owner' ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentPortal === 'owner' && (
                    <motion.div
                      layoutId="activePortal"
                      className={`absolute inset-0 bg-gradient-to-r ${portalGradient} rounded-full shadow-lg`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Briefcase className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Executive</span>
                </motion.button>
              </div>
            </div>

            {/* Right - Settings & User */}
            <div className="flex items-center gap-3">
              {/* User Role Indicator */}
              <motion.div
                className={`glass-strong px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md border-2 border-${portalColor}-200/30`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${portalGradient} animate-pulse`} />
                <User className={`w-4 h-4 text-${portalColor}-600`} />
                <span className={`text-sm font-semibold text-${portalColor}-700 capitalize`}>
                  {currentPortal === 'employee' ? 'Employee' : 'Executive'}
                </span>
              </motion.div>

              {/* Settings */}
              <motion.button
                onClick={() => setShowSettings(true)}
                className="glass-strong p-3 rounded-full hover:glass-hover transition-all duration-200 group shadow-md"
                aria-label="Settings"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="w-5 h-5 text-gray-700 transition-colors group-hover:text-primary-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
