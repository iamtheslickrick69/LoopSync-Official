import { AnimatePresence } from 'framer-motion';
import { usePortalStore } from './store/portalStore';
import { TopNav } from './components/layout/TopNav';
import { Background3D } from './components/layout/Background3D';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { OwnerPortal } from './components/owner/OwnerPortal';
import { LandingPage } from './components/LandingPage';

function App() {
  const { currentPortal, showLandingPage } = usePortalStore();

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
