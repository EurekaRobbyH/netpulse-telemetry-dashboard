import React, { useState } from 'react';
import { BookOpen, Layers, GitBranch, Database, CheckSquare, Terminal } from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [docTab, setDocTab] = useState<'ALL' | 'PRD' | 'TRD' | 'AFD' | 'BSD' | 'IPD'>('ALL');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Engineering Documentation Suite</h2>
              <p className="text-xs text-slate-400">
                Architectural design documents covering Product (PRD), Technical (TRD), App Flow (AFD), and Data Schemas (BSD).
              </p>
            </div>
          </div>

          {/* Doc Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            {(['ALL', 'PRD', 'TRD', 'AFD', 'BSD', 'IPD'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setDocTab(tab)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  docTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. PRD Card */}
        {(docTab === 'ALL' || docTab === 'PRD') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4" />
              <span>PRD &bull; Product Requirement Documentation</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>Problem Statement:</strong> Network operations teams managing distributed telecommunication clusters struggle with high-latency reporting, fragmented infrastructure metrics, and delayed SLA breach detection.
              </p>
              <p>
                <strong>Target Users:</strong> NOC Engineers, Telco Network Architects, SLA Contract Managers.
              </p>
              <p>
                <strong>Key Features Delivered:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Continuous 24-hour server telemetry monitoring (CPU, RAM, Disk, Disk I/O).</li>
                <li>Bi-directional (Southbound & Northbound) SLA availability tracking with 99.90% SLA threshold lines.</li>
                <li>Automated period-over-period delta comparison: <code className="text-indigo-300 font-mono">H - (H-1)</code> and <code className="text-indigo-300 font-mono">(H-1) - (H-2)</code>.</li>
                <li>Client-side one-click export to multi-sheet Excel (<code className="text-indigo-300 font-mono">.xlsx</code>) and raw <code className="text-indigo-300 font-mono">.csv</code>.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 2. TRD Card */}
        {(docTab === 'ALL' || docTab === 'TRD') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4" />
              <span>TRD &bull; Technical Requirement Documentation</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>Technology Stack:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><strong>Core Engine:</strong> React 18 + Next.js / Vite with Strict TypeScript typing.</li>
                <li><strong>Styling & UI:</strong> Tailwind CSS v3 with dark/light theme tokens and Lucide icons.</li>
                <li><strong>Visualization:</strong> Recharts (SVG Composed & Area Charts) with memoized delta indicators.</li>
                <li><strong>Workbook Generator:</strong> SheetJS (<code className="text-cyan-300 font-mono">xlsx</code>) for in-memory binary spreadsheet compilation.</li>
                <li><strong>State Model:</strong> Isolated functional slices with immutable update patterns.</li>
              </ul>
              <p>
                <strong>Performance Target:</strong> Sub-50ms chart re-rendering under 24-point telemetry updates using memoized delta calculation (<code className="text-cyan-300 font-mono">useMemo</code>).
              </p>
            </div>
          </div>
        )}

        {/* 3. AFD Card */}
        {(docTab === 'ALL' || docTab === 'AFD') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
              <GitBranch className="w-4 h-4" />
              <span>AFD &bull; Application Flow Documentation</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>Data Lifecycle Pipeline:</strong>
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800 leading-snug">
                Telemetry Poller / API<br />
                &nbsp;&nbsp;&darr;<br />
                JWT REST Authentication / Mock Generator<br />
                &nbsp;&nbsp;&darr;<br />
                Redux State Slices (Filtered by Node IP & Period)<br />
                &nbsp;&nbsp;&darr;<br />
                useMemo Delta Computation [H - (H-1)]<br />
                &nbsp;&nbsp;&darr;<br />
                Interactive Charts &amp; Client-Side Blob Export (XLSX / CSV)
              </div>
              <p className="text-slate-400">
                Guarantees zero unnecessary re-renders when toggling between CPU, RAM, Disk, and I/O metric tabs.
              </p>
            </div>
          </div>
        )}

        {/* 4. BSD Card */}
        {(docTab === 'ALL' || docTab === 'BSD') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
              <Database className="w-4 h-4" />
              <span>BSD &bull; Backend Schema Documentation</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>Time-Series Telemetry Contract:</strong>
              </p>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-[10.5px] font-mono text-amber-300 border border-slate-800 overflow-x-auto">
{`interface HourlyMetric {
  hour: "14:00";
  cpuUsage: 78.4; // %
  ramUsage: 62.1; // %
  diskUsage: 71.0; // %
  diskIoReads: 48.2; // MB/s
  diskIoWrites: 22.1; // MB/s
}`}
              </pre>
              <p>
                <strong>SLA Record Contract:</strong>
              </p>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-[10.5px] font-mono text-amber-300 border border-slate-800 overflow-x-auto">
{`interface SlaRecord {
  period: "2026-11-12";
  targetPercentage: 99.90;
  achievedPercentage: 99.94;
  deltaPrev: +0.03; // H - (H-1)
  status: "met" | "breached";
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

