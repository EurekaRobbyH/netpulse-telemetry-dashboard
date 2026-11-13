import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Cpu, HardDrive, Database, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { HourlyServerMetric, ServerNode } from '../../types';

interface ServerUsageCardProps {
  metrics: HourlyServerMetric[];
  nodes: ServerNode[];
  selectedNode: ServerNode;
  onSelectNode: (node: ServerNode) => void;
}

export const ServerUsageCard: React.FC<ServerUsageCardProps> = ({
  metrics,
  nodes,
  selectedNode,
  onSelectNode,
}) => {
  const [activeMetric, setActiveMetric] = useState<'ALL' | 'CPU' | 'RAM' | 'DISK' | 'IO'>('ALL');

  const latest = metrics[metrics.length - 1] || { cpuUsage: 0, ramUsage: 0, diskUsage: 0, diskIoReads: 0 };
  const prev = metrics[metrics.length - 2] || latest;
  const cpuDelta = Math.round((latest.cpuUsage - prev.cpuUsage) * 10) / 10;
  const ramDelta = Math.round((latest.ramUsage - prev.ramUsage) * 10) / 10;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              24-Hour Server Hourly Telemetry Trend
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sliding window telemetry tracking across CPU, RAM, storage, and I/O bus.
          </p>
        </div>

        {/* Node IP Selector Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Target Node:</label>
          <select
            value={selectedNode.id}
            onChange={e => {
              const found = nodes.find(n => n.id === e.target.value);
              if (found) onSelectNode(found);
            }}
            className="w-full sm:w-auto text-xs font-semibold bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.hostname} ({n.ip}) - {n.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick KPI Stat Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CPU Load</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-bold text-white">{latest.cpuUsage}%</span>
            <span className={`text-[11px] flex items-center font-medium ${cpuDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {cpuDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(cpuDelta)}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RAM Used</span>
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-bold text-white">{latest.ramUsage}%</span>
            <span className={`text-[11px] flex items-center font-medium ${ramDelta >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {ramDelta >= 0 ? '+' : ''}{ramDelta}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Disk Usage</span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-bold text-white">{latest.diskUsage}%</span>
            <span className="text-[11px] text-slate-500 font-medium">820 GB / 1 TB</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Disk I/O Reads</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-bold text-white">{latest.diskIoReads}</span>
            <span className="text-[11px] text-slate-400">MB/s</span>
          </div>
        </div>
      </div>

      {/* Metric Filter Chips */}
      <div className="flex items-center space-x-2 pb-3 overflow-x-auto">
        {(['ALL', 'CPU', 'RAM', 'DISK', 'IO'] as const).map(m => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              activeMetric === m
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {m === 'ALL' ? 'Combined Overview' : `${m} Only`}
          </button>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="diskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
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

            {(activeMetric === 'ALL' || activeMetric === 'CPU') && (
              <Area
                type="monotone"
                dataKey="cpuUsage"
                name="CPU Utilization (%)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#cpuGrad)"
              />
            )}
            {(activeMetric === 'ALL' || activeMetric === 'RAM') && (
              <Area
                type="monotone"
                dataKey="ramUsage"
                name="RAM Consumption (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#ramGrad)"
              />
            )}
            {(activeMetric === 'ALL' || activeMetric === 'DISK') && (
              <Area
                type="monotone"
                dataKey="diskUsage"
                name="Disk Allocation (%)"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#diskGrad)"
              />
            )}
            {(activeMetric === 'ALL' || activeMetric === 'IO') && (
              <Area
                type="monotone"
                dataKey="diskIoReads"
                name="Disk I/O Reads (MB/s)"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#ioGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

