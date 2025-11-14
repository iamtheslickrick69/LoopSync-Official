import { motion } from 'framer-motion';
import { Message } from '../../types/chat';
import { formatRelativeTime } from '../../utils/formatters';
import { AIOrb } from '../shared/AIOrb';

interface MessageBubbleProps {
  message: Message;
  delay?: number;
}

export function MessageBubble({ message, delay = 0 }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gray-400 to-gray-500">
          <span className="text-white text-xs font-medium">You</span>
        </div>
      ) : (
        <div className="flex-shrink-0 scale-50 origin-top-left">
          <AIOrb size="small" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-sm'
              : 'glass text-gray-900 rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
