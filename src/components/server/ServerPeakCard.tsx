import React from 'react';
import { Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SERVER_PEAK_RUNTIMES } from '../../data/mockTelemetryGenerator';

export const ServerPeakCard: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
        <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Gauge className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Peak Runtime Telemetry & Thresholds</h3>
          <p className="text-[11px] text-slate-400">
            Real-time threshold monitoring vs historical all-time peak telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {SERVER_PEAK_RUNTIMES.map((item, idx) => {
          const isElevated = item.status === 'elevated';
          const percentOfThreshold = Math.min(100, Math.round((item.currentPeak / item.threshold) * 100));

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-300">{item.metric}</span>
                {isElevated ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Elevated</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Normal</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-xl font-extrabold text-white">
                  {item.currentPeak}
                </span>
                <span className="text-xs font-semibold text-slate-400">{item.unit}</span>
                <span className="text-[11px] text-slate-500 ml-auto">Limit: {item.threshold}{item.unit}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isElevated ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentOfThreshold}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                <span>All-Time Max: {item.highestAllTime}{item.unit}</span>
                <span>{percentOfThreshold}% of Cap</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

