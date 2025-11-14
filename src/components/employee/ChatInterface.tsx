import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/portalStore';
import { claudeService } from '../../services/claudeAPI';
import { MessageBubble } from './MessageBubble';
import { GlassCard } from '../shared/GlassCard';
import { AIOrb } from '../shared/AIOrb';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isInitialState, setIsInitialState] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, addMessage, setTyping, setError } = useChatStore();
  const { claudeApiKey } = useSettingsStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0) {
      setIsInitialState(false);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsInitialState(false);

    // Add user message
    addMessage({ role: 'user', content: userMessage });

    if (!claudeApiKey || !claudeService.isInitialized()) {
      setError('Please set your Claude API key in settings');
      return;
    }

    setTyping(true);
    setError(null);

    try {
      // Prepare conversation history for Claude
      const conversationHistory = [
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: userMessage },
      ];

      let assistantResponse = '';

      // Send to Claude with streaming
      await claudeService.sendMessage(
        conversationHistory,
        (chunk) => {
          assistantResponse += chunk;
        }
      );

      // Add assistant message
      addMessage({ role: 'assistant', content: assistantResponse });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to get response from Coro'
      );
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GlassCard className="h-[600px] flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
        {isInitialState && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="flex justify-center mb-6">
              <AIOrb size="medium" />
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              Hi! I'm <span className="text-gradient-orb">Coro</span>
            </p>
            <p className="text-gray-600 text-base">
              Your trusted AI assistant for workplace feedback and support.
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Share your thoughts, concerns, or feedback with me anytime.
            </p>
          </motion.div>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} delay={index * 0.05} />
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              <AIOrb size="small" isThinking />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-gray-600">
                Coro is thinking<span className="animate-pulse">...</span>
              </p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/50 p-4">
        <div className="flex items-end gap-3">
          <button
            className="p-3 glass rounded-full hover:bg-white/90 transition-all duration-200 flex-shrink-0"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 glass rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts, concerns, or feedback..."
              className="w-full bg-transparent resize-none focus:outline-none text-gray-900 placeholder:text-gray-500"
              rows={1}
              style={{
                minHeight: '24px',
                maxHeight: '120px',
              }}
            />
          </div>

          <button
            className="p-3 glass rounded-full hover:bg-white/90 transition-all duration-200 flex-shrink-0"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
