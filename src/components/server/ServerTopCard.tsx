import React, { useState } from 'react';
import { Award, Server, TrendingUp } from 'lucide-react';
import { generateTopServers } from '../../data/mockTelemetryGenerator';
import { ServerTopUsage } from '../../types';

export const ServerTopCard: React.FC = () => {
  const [metric, setMetric] = useState<'CPU' | 'RAM' | 'DISK' | 'IO'>('CPU');
  const items: ServerTopUsage[] = generateTopServers(metric);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Top Resource Consuming Server Nodes
            </h3>
            <p className="text-[11px] text-slate-400">
              Ranked list of cluster nodes by peak load allocation.
            </p>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['CPU', 'RAM', 'DISK', 'IO'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                metric === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2 px-3"># Rank</th>
              <th className="py-2 px-3">Node Hostname</th>
              <th className="py-2 px-3">IP Address</th>
              <th className="py-2 px-3">Peak Hour</th>
              <th className="py-2 px-3 text-right">{metric} Peak Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map(item => (
              <tr key={item.nodeId} className="hover:bg-slate-800/30 transition">
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      item.rank === 1
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : item.rank === 2
                        ? 'bg-slate-400/20 text-slate-200 border border-slate-400/40'
                        : item.rank === 3
                        ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.rank}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.hostname}</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-400">{item.ip}</td>
                <td className="py-2.5 px-3 text-slate-400">{item.peakHour}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.value} {item.unit}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

