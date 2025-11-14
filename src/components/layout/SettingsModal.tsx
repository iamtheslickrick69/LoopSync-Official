import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Activity, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../store/portalStore';
import { claudeService } from '../../services/claudeAPI';
import { feedbackAnalysisService } from '../../services/feedbackAnalysis';
import { clearDemoData, seedDemoData, hasFeedbackData } from '../../services/demoData';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { claudeApiKey, setClaudeApiKey } = useSettingsStore();
  const [apiKey, setApiKey] = useState(claudeApiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (claudeApiKey) {
      setApiKey(claudeApiKey);
    }
  }, [claudeApiKey]);

  useEffect(() => {
    // Update API call count periodically
    const interval = setInterval(() => {
      setApiCallCount(feedbackAnalysisService.getApiCallCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    setClaudeApiKey(apiKey);
    claudeService.initialize(apiKey);
    setTestResult('success');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      claudeService.initialize(apiKey);
      const success = await claudeService.testConnection();
      setTestResult(success ? 'success' : 'error');
      if (success) {
        setClaudeApiKey(apiKey);
      }
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedDemo = () => {
    seedDemoData();
    alert('Demo data loaded! Switch to Owner portal to see the dashboard.');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all feedback data?')) {
      clearDemoData();
      alert('All feedback data cleared.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claude API Key
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk-ant-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono text-sm pr-20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    Get your API key from{' '}
                    <a
                      href="https://console.anthropic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    🔒 Your API key is stored locally and never sent to our servers
                  </p>
                </div>

                {/* Test Connection */}
                {apiKey && (
                  <div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleTest}
                      isLoading={isTesting}
                      className="w-full"
                    >
                      {isTesting ? 'Testing...' : 'Test Connection'}
                    </Button>

                    {testResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                          testResult === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {testResult === 'success' ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Connection successful!
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Connection failed. Check your API key.
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="glass rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          claudeService.isInitialized()
                            ? 'bg-green-500 animate-pulse'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-gray-700 font-medium">
                        {claudeService.isInitialized()
                          ? '🟢 Connected'
                          : '🔴 Not Connected'}
                      </span>
                    </div>
                    <Activity className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600">
                    API calls this session: <span className="font-bold text-primary-600">{apiCallCount}</span>
                  </div>
                </div>

                {/* Demo Data Management */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Mode</h3>
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSeedDemo}
                      className="w-full"
                    >
                      Load Demo Data
                    </Button>
                    {hasFeedbackData() && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleClearData}
                        className="w-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex gap-3">
                <Button variant="secondary" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
