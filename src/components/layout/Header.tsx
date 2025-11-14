import { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/60 border-b border-white/20 shadow-glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-purple rounded-2xl flex items-center justify-center shadow-glass">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient tracking-tight">LoopSync</h1>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trust Infrastructure Platform</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="glass-subtle p-3 rounded-full hover:bg-white/90 hover:shadow-glass transition-all duration-300 group"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
