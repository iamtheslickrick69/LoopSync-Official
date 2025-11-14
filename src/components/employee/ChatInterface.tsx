import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/portalStore';
import { claudeService } from '../../services/claudeAPI';
import { MessageBubble } from './MessageBubble';
import { GlassCard } from '../shared/GlassCard';

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
    <GlassCard className="h-[600px] flex flex-col shadow-glass-lg p-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-4">
        {isInitialState && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-purple rounded-3xl blur opacity-50 animate-pulse-glow" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-purple rounded-3xl flex items-center justify-center shadow-glass">
                <span className="text-white text-3xl">💬</span>
              </div>
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              Hi! I'm Coro, your trusted AI assistant.
            </p>
            <p className="text-gray-500 text-base mt-2 leading-relaxed">
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
            className="flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-purple rounded-full flex items-center justify-center flex-shrink-0 shadow-glow">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div className="glass-subtle rounded-2xl rounded-tl-sm px-5 py-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full animate-bounce animation-delay-100" />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full animate-bounce animation-delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/30 p-6 bg-gradient-to-b from-transparent to-white/20">
        <div className="flex items-end gap-3">
          <button
            className="p-3.5 glass-subtle rounded-full hover:bg-white/90 hover:shadow-glass transition-all duration-300 flex-shrink-0 group"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>

          <div className="flex-1 glass-strong rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-300 transition-all duration-300 hover:shadow-glass">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts, concerns, or feedback..."
              className="w-full bg-transparent resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 leading-relaxed"
              rows={1}
              style={{
                minHeight: '24px',
                maxHeight: '120px',
              }}
            />
          </div>

          <button
            className="p-3.5 glass-subtle rounded-full hover:bg-white/90 hover:shadow-glass transition-all duration-300 flex-shrink-0 group"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3.5 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-purple rounded-full hover:from-primary-600 hover:via-primary-700 hover:to-accent-purple transition-all duration-300 shadow-glass hover:shadow-glass-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 group"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
