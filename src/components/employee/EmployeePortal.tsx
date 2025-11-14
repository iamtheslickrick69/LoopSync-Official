import { motion } from 'framer-motion';
import { ChatInterface } from './ChatInterface';
import { StarterPrompts } from './StarterPrompts';
import { useChatStore } from '../../store/chatStore';

export function EmployeePortal() {
  const { addMessage } = useChatStore();

  const handlePromptSelect = (prompt: string) => {
    addMessage({ role: 'user', content: prompt });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 max-w-4xl mx-auto px-8 py-12"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
          How can{' '}
          <span className="text-gradient animate-pulse-glow">Coro</span>
          {' '}help you today?
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Your trusted AI assistant for workplace feedback and support
        </p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChatInterface />
      </motion.div>

      {/* Starter Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StarterPrompts onSelect={handlePromptSelect} />
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          className="glass rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-glass-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-success">
            <span className="text-2xl">🔒</span>
          </div>
          <div className="text-3xl font-bold text-gradient mb-2">100%</div>
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Anonymous & Secure</div>
        </motion.div>
        <motion.div
          className="glass rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-glass-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-accent-cyan rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-3xl font-bold text-gradient-secondary mb-2">24/7</div>
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Always Available</div>
        </motion.div>
        <motion.div
          className="glass rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-glass-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-2xl">✨</span>
          </div>
          <div className="text-3xl font-bold text-gradient mb-2">AI-Powered</div>
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Intelligent Support</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
