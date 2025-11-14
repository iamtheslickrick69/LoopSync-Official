import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePortalStore, useSettingsStore } from './store/portalStore';
import { TopNav } from './components/layout/TopNav';
import { Background3D } from './components/layout/Background3D';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { OwnerPortal } from './components/owner/OwnerPortal';
import { LandingPage } from './components/LandingPage';
import { seedDemoData, hasFeedbackData } from './services/demoData';
import { claudeService } from './services/claudeAPI';

function App() {
  const { currentPortal, showLandingPage } = usePortalStore();
  const { claudeApiKey, setClaudeApiKey } = useSettingsStore();

  useEffect(() => {
    // Check for API key from environment variables
    const envApiKey = import.meta.env.VITE_CLAUDE_API_KEY;

    console.log('🔑 API Key Debug:', {
      envApiKey: envApiKey ? `${envApiKey.substring(0, 15)}...` : 'NOT FOUND',
      storedApiKey: claudeApiKey ? `${claudeApiKey.substring(0, 15)}...` : 'NOT FOUND',
      isInitialized: claudeService.isInitialized()
    });

    // If env key exists and no stored key, use env key
    if (envApiKey && !claudeApiKey) {
      console.log('✅ Initializing Claude API from environment variable');
      setClaudeApiKey(envApiKey);
      claudeService.initialize(envApiKey);
    } else if (claudeApiKey) {
      // Use stored key
      claudeService.initialize(claudeApiKey);
      console.log('✅ Claude API initialized from stored settings');
    } else {
      console.error('❌ No API key found! Please add VITE_CLAUDE_API_KEY to .env.local');
    }

    // Seed demo data if no feedback exists
    if (!hasFeedbackData()) {
      console.log('No feedback data found, seeding demo data...');
      seedDemoData();
    }
  }, [claudeApiKey, setClaudeApiKey]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showLandingPage ? (
          <LandingPage key="landing" />
        ) : (
          <>
            {/* 3D Background Elements */}
            <Background3D />

            {/* Top Navigation */}
            <TopNav />

            {/* Portal Content */}
            <main className="relative">
              <AnimatePresence mode="wait">
                {currentPortal === 'employee' ? (
                  <EmployeePortal key="employee" />
                ) : (
                  <OwnerPortal key="owner" />
                )}
              </AnimatePresence>
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
