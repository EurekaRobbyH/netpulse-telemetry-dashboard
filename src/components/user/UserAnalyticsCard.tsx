import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Users, Clock, Flame, LayoutGrid, Calendar } from 'lucide-react';
import { USER_ACTIVITY_DAYS, USER_RANKINGS } from '../../data/mockTelemetryGenerator';

export const UserAnalyticsCard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(USER_ACTIVITY_DAYS[USER_ACTIVITY_DAYS.length - 1].date);

  const activeDay = USER_ACTIVITY_DAYS.find(d => d.date === selectedDate) || USER_ACTIVITY_DAYS[0];
  const moduleRankings = USER_RANKINGS.filter(r => r.category === 'module');
  const activityRankings = USER_RANKINGS.filter(r => r.category === 'activity');

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">User Telemetry & Activity Monitoring</h2>
            <p className="text-xs text-slate-400">Auditing operator logins, peak busy hours, and module access distribution.</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {USER_ACTIVITY_DAYS.map(d => (
              <option key={d.date} value={d.date}>
                {d.date} (Logins: {d.totalLogins})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Daily Logins</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">{activeDay.totalLogins}</div>
          <span className="text-[11px] text-slate-500">Across {activeDay.uniqueActiveUsers} unique operators</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Busy Hour</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{activeDay.busyHour}</div>
          <span className="text-[11px] text-slate-500">{activeDay.busyHourLogins} concurrent requests recorded</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Top Active Module</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-bold text-white mt-2 truncate">RAN Observability & Telemetry</div>
          <span className="text-[11px] text-emerald-400">38.5% total platform traffic</span>
        </div>
      </div>

      {/* Login History Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">14-Day User Login Trajectory & Busy Hour Distribution</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USER_ACTIVITY_DAYS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userLoginsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalLogins"
                name="Total Logins"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#userLoginsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module and Activity Rankings (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module Rankings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Top 5 Telemetry Modules Usage</h3>
          </div>
          <div className="space-y-3">
            {moduleRankings.map((mod, idx) => (
              <div key={mod.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {idx + 1}. {mod.label}
                  </span>
                  <span className="text-slate-400 font-mono font-bold">{mod.percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${mod.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Rankings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Top 5 Operational User Activities</h3>
          </div>
          <div className="space-y-3">
            {activityRankings.map((act, idx) => (
              <div key={act.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {idx + 1}. {act.label}
                  </span>
                  <span className="text-slate-400 font-mono font-bold">{act.percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${act.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

