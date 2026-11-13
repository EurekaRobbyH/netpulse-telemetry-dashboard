import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { ShieldCheck, ArrowDown, ArrowUp, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateSlaHistory } from '../../data/mockTelemetryGenerator';
import { computePeriodDelta } from '../../utils/deltaCalculator';
import { exportToCsv } from '../../utils/exportCsv';
import { SlaRecord } from '../../types';

export const SlaOverviewCard: React.FC = () => {
  const [stream, setStream] = useState<'southbound' | 'northbound'>('southbound');
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const slaData: SlaRecord[] = useMemo(() => {
    const count = granularity === 'daily' ? 30 : granularity === 'weekly' ? 12 : 6;
    return generateSlaHistory(stream, count);
  }, [stream, granularity]);

  const targetSla = stream === 'southbound' ? 99.90 : 99.85;

  const handleExportCsv = () => {
    const exportRows = slaData.map(s => ({
      Period: s.period,
      Stream: s.stream.toUpperCase(),
      TargetSLA: `${s.targetPercentage}%`,
      AchievedSLA: `${s.achievedPercentage}%`,
      OutageMinutes: s.outageMinutes,
      DeltaVsPrevious: `${s.deltaPrev > 0 ? '+' : ''}${s.deltaPrev}%`,
      Status: s.status.toUpperCase(),
    }));
    exportToCsv(`NetPulse_SLA_${stream}_${granularity}`, exportRows);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all space-y-5">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              SLA Availability & Delta Analysis ({stream === 'southbound' ? 'Southbound SLA' : 'Northbound SLA'})
            </h2>
            <p className="text-xs text-slate-400">
              Multi-granularity availability reporting with period-over-period delta comparison.
            </p>
          </div>
        </div>

        {/* Stream & Granularity Selectors + Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stream Switcher */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setStream('southbound')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                stream === 'southbound' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Southbound
            </button>
            <button
              onClick={() => setStream('northbound')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                stream === 'northbound' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Northbound
            </button>
          </div>

          {/* Granularity Switcher */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-2.5 py-1 rounded-md capitalize font-semibold transition ${
                  granularity === g ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Main SLA Chart */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={slaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="slaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[99.3, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <ReferenceLine
              y={targetSla}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: `Target SLA (${targetSla}%)`, fill: '#ef4444', fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="achievedPercentage"
              name="Achieved SLA (%)"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#slaFill)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* SLA Sliding Window Delta Table */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          30-Point Sliding Window SLA Delta Ledger
        </h4>
        <div className="overflow-x-auto max-h-64 border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold z-10">
              <tr>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Target SLA</th>
                <th className="py-2.5 px-3">Achieved SLA</th>
                <th className="py-2.5 px-3">Outage (Min)</th>
                <th className="py-2.5 px-3">Period-over-Period Delta H-(H-1)</th>
                <th className="py-2.5 px-3 text-right">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {slaData.map((row, idx) => {
                const prevRow = slaData[idx - 1];
                const deltaInfo = prevRow ? computePeriodDelta(row.achievedPercentage, prevRow.achievedPercentage) : null;
                const isMet = row.status === 'met';

                return (
                  <tr key={row.period} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-mono font-medium text-slate-300">{row.period}</td>
                    <td className="py-2 px-3 text-slate-400">{row.targetPercentage}%</td>
                    <td className="py-2 px-3 font-bold text-white">{row.achievedPercentage}%</td>
                    <td className="py-2 px-3 text-slate-400">{row.outageMinutes} min</td>
                    <td className="py-2 px-3">
                      {deltaInfo ? (
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold border ${deltaInfo.statusClass}`}>
                          {deltaInfo.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span>{deltaInfo.formatted}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">&mdash; Baseline</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {isMet ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Met</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Breached</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

