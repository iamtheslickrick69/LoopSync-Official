import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/portalStore';
import { claudeService } from '../../services/claudeAPI';
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

  useEffect(() => {
    if (claudeApiKey) {
      setApiKey(claudeApiKey);
    }
  }, [claudeApiKey]);

  const handleSave = () => {
    setClaudeApiKey(apiKey);
    claudeService.initialize(apiKey);
    onClose();
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      claudeService.initialize(apiKey);
      const success = await claudeService.testConnection();
      setTestResult(success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
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
                  <Input
                    type="password"
                    placeholder="sk-ant-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-sm"
                  />
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
                      Test Connection
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
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      claudeService.isInitialized()
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-gray-600">
                    {claudeService.isInitialized()
                      ? 'Claude API Connected'
                      : 'Claude API Not Connected'}
                  </span>
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
