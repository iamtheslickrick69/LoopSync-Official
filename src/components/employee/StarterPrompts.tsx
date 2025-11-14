import { motion } from 'framer-motion';
import { MessageSquare, Shield, AlertCircle, PartyPopper, Lightbulb, Clock } from 'lucide-react';

const prompts = [
  {
    icon: Shield,
    text: 'Share anonymous feedback',
    gradient: 'from-primary-500 via-primary-600 to-accent-purple',
    glow: 'hover:shadow-glow',
  },
  {
    icon: MessageSquare,
    text: 'Ask about company policies',
    gradient: 'from-secondary-500 via-secondary-600 to-accent-cyan',
    glow: 'hover:shadow-glow-cyan',
  },
  {
    icon: AlertCircle,
    text: 'Report a workplace concern',
    gradient: 'from-danger-500 to-danger-600',
    glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  {
    icon: PartyPopper,
    text: 'Celebrate a team win',
    gradient: 'from-success-500 to-success-600',
    glow: 'hover:shadow-glow-success',
  },
  {
    icon: Lightbulb,
    text: 'Suggest an improvement',
    gradient: 'from-warning-500 to-warning-600',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
  {
    icon: Clock,
    text: 'Check my feedback history',
    gradient: 'from-primary-600 to-primary-700',
    glow: 'hover:shadow-glow',
  },
];

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="mt-8">
      <p className="text-sm font-medium text-gray-500 mb-6 text-center uppercase tracking-wide">Quick actions</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {prompts.map((prompt, index) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={prompt.text}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelect(prompt.text)}
              className={`glass-subtle px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-white/90 transition-all duration-300 flex items-center gap-2.5 group hover:scale-105 ${prompt.glow}`}
            >
              <div className={`p-1.5 rounded-full bg-gradient-to-r ${prompt.gradient} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="group-hover:text-gray-900 transition-colors">{prompt.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
