import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/portalStore';
import { useFeedbackStore } from '../../store/feedbackStore';
import { claudeService } from '../../services/claudeAPI';
import { MessageBubble } from './MessageBubble';
import { DraftMessageCard } from './DraftMessageCard';
import { GlassCard } from '../shared/GlassCard';
import { DraftMetadata } from '../../types/chat';
import { Tag } from '../../types/feedback';

// Helper function to parse draft messages from Coro's response
function parseDraftMessage(response: string): { hasNormalText: string; draft: DraftMetadata | null; draftContent: string } {
  const draftRegex = /<DRAFT_MESSAGE>([\s\S]*?)<\/DRAFT_MESSAGE>/;
  const match = response.match(draftRegex);

  if (!match) {
    return { hasNormalText: response, draft: null, draftContent: '' };
  }

  const draftBlock = match[1];
  const normalText = response.replace(match[0], '').trim();

  // Parse privacy level
  const privacyMatch = draftBlock.match(/<PRIVACY_LEVEL>(.*?)<\/PRIVACY_LEVEL>/);
  const privacyLevel = (privacyMatch?.[1].trim() || 'anonymous') as 'anonymous' | 'group' | 'department' | 'identified';

  // Parse urgency
  const urgencyMatch = draftBlock.match(/<URGENCY>(.*?)<\/URGENCY>/);
  const urgency = (urgencyMatch?.[1].trim() || 'general') as 'general' | 'priority' | 'critical';

  // Parse tags
  const tagsMatch = draftBlock.match(/<TAGS>(.*?)<\/TAGS>/);
  const tagsStr = tagsMatch?.[1].trim() || '';
  const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Parse content
  const contentMatch = draftBlock.match(/<CONTENT>([\s\S]*?)<\/CONTENT>/);
  const draftContent = contentMatch?.[1].trim() || '';

  return {
    hasNormalText: normalText,
    draft: { privacyLevel, urgency, tags },
    draftContent,
  };
}

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isInitialState, setIsInitialState] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, addMessage, updateMessage, removeMessage, setTyping, setError } = useChatStore();
  const { addFeedback } = useFeedbackStore();
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
      // Prepare conversation history for Claude (exclude draft messages, only user/assistant)
      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      conversationHistory.push({ role: 'user' as const, content: userMessage });

      let assistantResponse = '';

      // Send to Claude with streaming
      await claudeService.sendMessage(
        conversationHistory,
        (chunk) => {
          assistantResponse += chunk;
        }
      );

      // Parse response for draft messages
      const parsed = parseDraftMessage(assistantResponse);

      // Add normal assistant message if there's text
      if (parsed.hasNormalText) {
        addMessage({ role: 'assistant', content: parsed.hasNormalText });
      }

      // Add draft message if present
      if (parsed.draft && parsed.draftContent) {
        addMessage({
          role: 'draft',
          content: parsed.draftContent,
          draftMetadata: parsed.draft,
          approved: false,
        });
      }
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

  const handleApproveDraft = async (messageId: string) => {
    const draftMessage = messages.find(m => m.id === messageId);
    if (!draftMessage || !draftMessage.draftMetadata) return;

    // Convert tags array to Tag objects
    const feedbackTags: Tag[] = draftMessage.draftMetadata.tags.map(tag => ({
      type: 'topic' as const,
      value: tag,
    }));

    // Determine sentiment based on urgency (simple heuristic)
    const sentiment = draftMessage.draftMetadata.urgency === 'critical' ? -1 :
                      draftMessage.draftMetadata.urgency === 'priority' ? -0.5 : 0;

    // Submit to feedback store
    addFeedback({
      privacyLevel: draftMessage.draftMetadata.privacyLevel,
      urgency: draftMessage.draftMetadata.urgency,
      content: draftMessage.content,
      sentiment: sentiment as -1 | -0.5 | 0 | 0.5 | 1,
      tags: feedbackTags,
      status: 'unread',
    });

    // Mark as approved and add confirmation message
    updateMessage(messageId, { approved: true });
    addMessage({
      role: 'assistant',
      content: '✅ Your message has been successfully submitted to the leadership dashboard. They will review it and may respond if needed. Is there anything else I can help you with?',
    });
  };

  const handleRejectDraft = (messageId: string) => {
    removeMessage(messageId);
    addMessage({
      role: 'assistant',
      content: 'No problem! The draft has been discarded. Would you like me to help you with something else?',
    });
  };

  const handleEditDraft = (messageId: string, newContent: string) => {
    updateMessage(messageId, { content: newContent });
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

        {messages.map((message, index) => {
          if (message.role === 'draft' && !message.approved) {
            return (
              <DraftMessageCard
                key={message.id}
                message={message}
                onApprove={handleApproveDraft}
                onReject={handleRejectDraft}
                onEdit={handleEditDraft}
              />
            );
          }

          // Don't show approved drafts as regular messages
          if (message.role === 'draft' && message.approved) {
            return null;
          }

          return (
            <MessageBubble key={message.id} message={message} delay={index * 0.05} />
          );
        })}

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
