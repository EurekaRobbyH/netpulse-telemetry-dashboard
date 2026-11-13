export interface ServerNode {
  id: string;
  ip: string;
  hostname: string;
  role: 'edge-gateway' | 'compute-node' | 'db-cluster' | 'ingress-proxy' | 'telemetry-poller';
  status: 'healthy' | 'warning' | 'critical';
  region: string;
  uptimeHours: number;
}

export interface HourlyServerMetric {
  hour: string; // e.g., "00:00", "01:00"
  timestamp: string;
  cpuUsage: number; // percentage 0-100
  ramUsage: number; // percentage 0-100
  diskUsage: number; // percentage 0-100
  diskIoReads: number; // MB/s
  diskIoWrites: number; // MB/s
}

export interface ServerTopUsage {
  rank: number;
  nodeId: string;
  ip: string;
  hostname: string;
  metricType: 'CPU' | 'RAM' | 'DISK' | 'IO';
  value: number;
  unit: string;
  peakHour: string;
}

export interface ServerPeakRuntime {
  metric: string;
  currentPeak: number;
  highestAllTime: number;
  unit: string;
  status: 'normal' | 'elevated' | 'critical';
  threshold: number;
}

export type SlaGranularity = 'daily' | 'weekly' | 'monthly';

export interface SlaRecord {
  period: string; // e.g. "2026-11-12", "W45-2026", "Nov 2026"
  targetPercentage: number; // e.g. 99.90
  achievedPercentage: number; // e.g. 99.94
  outageMinutes: number;
  stream: 'southbound' | 'northbound';
  deltaPrev: number; // H - (H-1)
  deltaPrevPrev?: number; // (H-1) - (H-2)
  status: 'met' | 'breached' | 'warning';
}

export interface UserActivityMetric {
  date: string;
  totalLogins: number;
  busyHour: string;
  busyHourLogins: number;
  uniqueActiveUsers: number;
}

export interface UserRankingItem {
  id: string;
  label: string;
  category: 'activity' | 'module' | 'lifetime';
  count: number;
  percentage: number;
}

