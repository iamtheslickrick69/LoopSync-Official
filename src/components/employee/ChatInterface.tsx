import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/portalStore';
import { claudeService } from '../../services/claudeAPI';
import { MessageBubble } from './MessageBubble';
import { GlassCard } from '../shared/GlassCard';
import { Button } from '../shared/Button';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isInitialState, setIsInitialState] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isTyping,
    addMessage,
    setTyping,
    setError,
    submitConversationAsFeedback,
    isSubmittingFeedback,
    clearMessages
  } = useChatStore();
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

  const handleSubmitFeedback = async () => {
    const success = await submitConversationAsFeedback();
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        clearMessages();
        setIsInitialState(true);
      }, 2000);
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
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💬</span>
            </div>
            <p className="text-gray-600 text-lg">
              Hi! I'm Coro, your trusted AI assistant.
            </p>
            <p className="text-gray-500 text-sm mt-2">
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">C</span>
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Submit as Feedback Button */}
      <AnimatePresence>
        {messages.length > 0 && !showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 border-t border-gray-200/50"
          >
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitFeedback}
              isLoading={isSubmittingFeedback}
              className="w-full flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmittingFeedback ? 'Analyzing & Submitting...' : 'Submit as Feedback'}
            </Button>
          </motion.div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="px-4 py-3 bg-green-50 border-t border-green-200"
          >
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Feedback submitted successfully! Leadership will review it soon.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
