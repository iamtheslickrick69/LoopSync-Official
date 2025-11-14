import { useState } from 'react';
import { Check, X, Edit2, Shield, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '../../types/chat';
import { GlassCard } from '../shared/GlassCard';

interface DraftMessageCardProps {
  message: Message;
  onApprove: (messageId: string) => void;
  onReject: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
}

export function DraftMessageCard({ message, onApprove, onReject, onEdit }: DraftMessageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!message.draftMetadata) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(message.id);
    setIsProcessing(false);
  };

  const handleReject = () => {
    onReject(message.id);
  };

  const handleSaveEdit = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const privacyIcons = {
    anonymous: { icon: Shield, label: 'Anonymous', color: 'text-green-600' },
    group: { icon: Shield, label: 'Group Anonymous', color: 'text-blue-600' },
    department: { icon: Info, label: 'Department Level', color: 'text-purple-600' },
    identified: { icon: Info, label: 'Identified', color: 'text-gray-600' },
  };

  const urgencyColors = {
    general: 'border-gray-300 bg-gray-50',
    priority: 'border-yellow-400 bg-yellow-50',
    critical: 'border-red-400 bg-red-50',
  };

  const PrivacyIcon = privacyIcons[message.draftMetadata.privacyLevel].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">C</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* Coro's explanation */}
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-gray-700 text-sm">
            I've drafted this message for you to review. If you approve it, I'll submit it on your behalf to the leadership dashboard.
          </p>
        </div>

        {/* Draft card */}
        <GlassCard className={`border-2 ${urgencyColors[message.draftMetadata.urgency]} p-4 space-y-3`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Draft Message for Approval</span>
            </div>
            <div className={`flex items-center gap-1 text-sm ${privacyIcons[message.draftMetadata.privacyLevel].color}`}>
              <PrivacyIcon className="w-4 h-4" />
              <span>{privacyIcons[message.draftMetadata.privacyLevel].label}</span>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{editedContent}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              message.draftMetadata.urgency === 'critical' ? 'bg-red-100 text-red-700' :
              message.draftMetadata.urgency === 'priority' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {message.draftMetadata.urgency === 'critical' ? '🔴 Critical' :
               message.draftMetadata.urgency === 'priority' ? '🟡 Priority' :
               '🟢 General'}
            </span>
            {message.draftMetadata.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditedContent(message.content);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 glass rounded-lg hover:bg-white/90 transition-all font-medium text-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  {isProcessing ? 'Submitting...' : 'Approve & Send'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/90 transition-all font-medium text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg hover:bg-red-50 transition-all font-medium text-red-600"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
