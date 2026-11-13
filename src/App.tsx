import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { ServerUsageCard } from './components/server/ServerUsageCard';
import { ServerTopCard } from './components/server/ServerTopCard';
import { ServerPeakCard } from './components/server/ServerPeakCard';
import { SlaOverviewCard } from './components/availability/SlaOverviewCard';
import { UserAnalyticsCard } from './components/user/UserAnalyticsCard';
import { ArchitectureViewer } from './components/docs/ArchitectureViewer';
import {
  SERVER_NODES,
  generate24HourMetrics,
  generateTopServers,
  SERVER_PEAK_RUNTIMES,
  generateSlaHistory,
} from './data/mockTelemetryGenerator';
import { exportFullTelemetryWorkbook } from './utils/exportXlsx';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('server');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState(SERVER_NODES[0]);

  // Sync HTML dark class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Compute 24-hr metrics for selected node
  const hourlyMetrics = useMemo(() => {
    return generate24HourMetrics(selectedNode.id);
  }, [selectedNode.id]);

  // Master XLSX export handler
  const handleExportAll = () => {
    const topServers = generateTopServers('CPU');
    const slaRecords = generateSlaHistory('southbound', 30);
    exportFullTelemetryWorkbook(
      hourlyMetrics,
      topServers,
      SERVER_PEAK_RUNTIMES,
      slaRecords,
      selectedNode.ip
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onExportAll={handleExportAll}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Server Observability */}
        {activeTab === 'server' && (
          <div className="space-y-6">
            <ServerUsageCard
              metrics={hourlyMetrics}
              nodes={SERVER_NODES}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ServerTopCard />
              </div>
              <div className="lg:col-span-5">
                <ServerPeakCard />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SLA Availability */}
        {activeTab === 'availability' && <SlaOverviewCard />}

        {/* Tab 3: User Analytics */}
        {activeTab === 'user' && <UserAnalyticsCard />}

        {/* Tab 4: Architecture Documentation */}
        {activeTab === 'docs' && <ArchitectureViewer />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-400">NetPulse Observability Suite</span> &bull; Production Telemetry Showcase
          </div>
          <div className="flex items-center space-x-4">
            <span>Engineered by <strong>Eureka Robby Harianja</strong></span>
            <span>&bull;</span>
            <a
              href="https://github.com/EurekaRobbyH/netpulse-telemetry-dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;

