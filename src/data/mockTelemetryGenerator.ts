import {
  ServerNode,
  HourlyServerMetric,
  ServerTopUsage,
  ServerPeakRuntime,
  SlaRecord,
  UserActivityMetric,
  UserRankingItem,
} from '../types';

export const SERVER_NODES: ServerNode[] = [
  { id: 'node-01', ip: '10.244.10.12', hostname: 'ran-core-edge-01', role: 'edge-gateway', status: 'healthy', region: 'Central-Java', uptimeHours: 2480 },
  { id: 'node-02', ip: '10.244.10.15', hostname: 'ran-core-edge-02', role: 'edge-gateway', status: 'healthy', region: 'Central-Java', uptimeHours: 1940 },
  { id: 'node-03', ip: '10.244.20.08', hostname: 'ran-db-clickhouse-01', role: 'db-cluster', status: 'warning', region: 'West-Java', uptimeHours: 3200 },
  { id: 'node-04', ip: '10.244.20.09', hostname: 'ran-db-clickhouse-02', role: 'db-cluster', status: 'healthy', region: 'West-Java', uptimeHours: 3200 },
  { id: 'node-05', ip: '10.244.30.22', hostname: 'ran-prom-telemetry-01', role: 'telemetry-poller', status: 'healthy', region: 'DKI-Jakarta', uptimeHours: 4120 },
  { id: 'node-06', ip: '10.244.30.23', hostname: 'ran-prom-telemetry-02', role: 'telemetry-poller', status: 'healthy', region: 'DKI-Jakarta', uptimeHours: 4120 },
  { id: 'node-07', ip: '10.244.40.50', hostname: 'ran-api-ingress-01', role: 'ingress-proxy', status: 'critical', region: 'East-Java', uptimeHours: 850 },
  { id: 'node-08', ip: '10.244.40.51', hostname: 'ran-api-ingress-02', role: 'ingress-proxy', status: 'healthy', region: 'East-Java', uptimeHours: 2750 },
];

export function generate24HourMetrics(nodeId: string): HourlyServerMetric[] {
  const seed = nodeId.charCodeAt(nodeId.length - 1) * 3;
  const hours: HourlyServerMetric[] = [];

  for (let i = 0; i < 24; i++) {
    const hourStr = `${String(i).padStart(2, '0')}:00`;
    // Traffic curve: peak during 10:00 - 15:00 and 19:00 - 22:00
    const peakFactor = (i >= 9 && i <= 16) || (i >= 19 && i <= 22) ? 1.45 : 0.85;
    const cpu = Math.min(98, Math.max(18, Math.round(((Math.sin(i / 3) * 15 + 45 + (seed % 10)) * peakFactor) * 10) / 10));
    const ram = Math.min(95, Math.max(35, Math.round((55 + (seed % 15) + (i * 0.8) % 18) * 10) / 10));
    const disk = Math.min(90, Math.max(40, Math.round((62 + (seed % 8)) * 10) / 10));
    const ioReads = Math.round((Math.sin(i / 2) * 18 + 42) * peakFactor * 10) / 10;
    const ioWrites = Math.round((Math.cos(i / 2) * 12 + 28) * peakFactor * 10) / 10;

    hours.push({
      hour: hourStr,
      timestamp: `2026-11-12T${hourStr}:00Z`,
      cpuUsage: cpu,
      ramUsage: ram,
      diskUsage: disk,
      diskIoReads: Math.max(5, ioReads),
      diskIoWrites: Math.max(3, ioWrites),
    });
  }

  return hours;
}

export function generateTopServers(metric: 'CPU' | 'RAM' | 'DISK' | 'IO'): ServerTopUsage[] {
  return SERVER_NODES.map((node, idx) => {
    let val = 0;
    let unit = '%';
    if (metric === 'CPU') {
      val = Math.round((88 - idx * 6.5 + (idx % 2 ? 4 : -2)) * 10) / 10;
    } else if (metric === 'RAM') {
      val = Math.round((92 - idx * 4.8) * 10) / 10;
    } else if (metric === 'DISK') {
      val = Math.round((84 - idx * 3.5) * 10) / 10;
    } else {
      val = Math.round((145 - idx * 14.2) * 10) / 10;
      unit = 'MB/s';
    }

    return {
      rank: idx + 1,
      nodeId: node.id,
      ip: node.ip,
      hostname: node.hostname,
      metricType: metric,
      value: Math.max(5, val),
      unit,
      peakHour: `${14 - (idx % 5)}:00`,
    };
  });
}

export const SERVER_PEAK_RUNTIMES: ServerPeakRuntime[] = [
  { metric: 'Max CPU Utilization', currentPeak: 89.4, highestAllTime: 96.2, unit: '%', status: 'elevated', threshold: 85 },
  { metric: 'Max RAM Consumption', currentPeak: 84.1, highestAllTime: 91.5, unit: '%', status: 'normal', threshold: 90 },
  { metric: 'Peak Disk Storage', currentPeak: 81.3, highestAllTime: 84.0, unit: '%', status: 'normal', threshold: 85 },
  { metric: 'Peak Disk I/O Throughput', currentPeak: 148.6, highestAllTime: 210.4, unit: 'MB/s', status: 'normal', threshold: 180 },
];

export function generateSlaHistory(stream: 'southbound' | 'northbound', count = 30): SlaRecord[] {
  const records: SlaRecord[] = [];
  const target = stream === 'southbound' ? 99.90 : 99.85;

  for (let i = count; i >= 1; i--) {
    const day = 30 - i + 1;
    const periodStr = `2026-10-${String(day).padStart(2, '0')}`;
    const baseAchieved = target + (Math.sin(i / 2) * 0.12) + (Math.cos(i) * 0.05);
    const achieved = Math.min(100, Math.max(99.4, Math.round(baseAchieved * 100) / 100));
    const outageMin = achieved < 99.9 ? Math.round((100 - achieved) * 14.4) : Math.round((100 - achieved) * 4);

    records.push({
      period: periodStr,
      targetPercentage: target,
      achievedPercentage: achieved,
      outageMinutes: Math.max(0, outageMin),
      stream,
      deltaPrev: 0,
      status: achieved >= target ? 'met' : achieved >= target - 0.1 ? 'warning' : 'breached',
    });
  }

  // Calculate period-over-period delta: H - (H-1) and (H-1) - (H-2)
  for (let j = 1; j < records.length; j++) {
    records[j].deltaPrev = Math.round((records[j].achievedPercentage - records[j - 1].achievedPercentage) * 100) / 100;
    if (j >= 2) {
      records[j].deltaPrevPrev = Math.round((records[j - 1].achievedPercentage - records[j - 2].achievedPercentage) * 100) / 100;
    }
  }

  return records;
}

export const USER_ACTIVITY_DAYS: UserActivityMetric[] = Array.from({ length: 14 }, (_, idx) => {
  const day = idx + 1;
  const total = Math.round(420 + Math.sin(idx) * 80 + (idx % 7 === 5 || idx % 7 === 6 ? -160 : 40));
  return {
    date: `2026-11-${String(day).padStart(2, '0')}`,
    totalLogins: total,
    busyHour: `${10 + (idx % 4)}:00`,
    busyHourLogins: Math.round(total * 0.28),
    uniqueActiveUsers: Math.round(total * 0.65),
  };
});

export const USER_RANKINGS: UserRankingItem[] = [
  { id: '1', label: 'RAN Observability & Telemetry', category: 'module', count: 4820, percentage: 38.5 },
  { id: '2', label: 'SLA Availability Monitoring', category: 'module', count: 3240, percentage: 25.9 },
  { id: '3', label: 'Server Performance Metrics', category: 'module', count: 2190, percentage: 17.5 },
  { id: '4', label: 'Report XLSX/CSV Export', category: 'module', count: 1420, percentage: 11.3 },
  { id: '5', label: 'User Auditing & Logs', category: 'module', count: 850, percentage: 6.8 },

  { id: '6', label: 'Dashboard Query & Filter', category: 'activity', count: 7210, percentage: 41.2 },
  { id: '7', label: 'Export Telemetry Workbooks', category: 'activity', count: 3950, percentage: 22.5 },
  { id: '8', label: 'SLA Delta Drill-down', category: 'activity', count: 3120, percentage: 17.8 },
  { id: '9', label: 'Server Incident Check', category: 'activity', count: 2240, percentage: 12.8 },
  { id: '10', label: 'Config Changes', category: 'activity', count: 1010, percentage: 5.7 },
];

