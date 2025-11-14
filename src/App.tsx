import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePortalStore, useSettingsStore } from './store/portalStore';
import { Header } from './components/layout/Header';
import { PortalToggle } from './components/layout/PortalToggle';
import { Background3D } from './components/layout/Background3D';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { OwnerPortal } from './components/owner/OwnerPortal';
import { seedDemoData, hasFeedbackData } from './services/demoData';
import { claudeService } from './services/claudeAPI';

function App() {
  const { currentPortal } = usePortalStore();
  const { claudeApiKey } = useSettingsStore();

  useEffect(() => {
    // Initialize Claude API if key exists
    if (claudeApiKey) {
      claudeService.initialize(claudeApiKey);
      console.log('Claude API initialized');
    }

    // Seed demo data if no feedback exists
    if (!hasFeedbackData()) {
      console.log('No feedback data found, seeding demo data...');
      seedDemoData();
    }
  }, [claudeApiKey]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      <Background3D />

      {/* Header */}
      <Header />

      {/* Portal Toggle */}
      <PortalToggle />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPortal === 'employee' ? (
            <EmployeePortal key="employee" />
          ) : (
            <OwnerPortal key="owner" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
