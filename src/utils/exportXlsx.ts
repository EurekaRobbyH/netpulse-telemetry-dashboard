import * as XLSX from 'xlsx';
import { HourlyServerMetric, ServerTopUsage, ServerPeakRuntime, SlaRecord } from '../types';

export function exportFullTelemetryWorkbook(
  hourlyData: HourlyServerMetric[],
  topServers: ServerTopUsage[],
  peakRuntimes: ServerPeakRuntime[],
  slaRecords: SlaRecord[],
  serverIp = 'all'
): void {
  const wb = XLSX.utils.book_new();

  // 1. Hourly Trend Sheet
  const hourlyRows = hourlyData.map(h => ({
    'Hour (24h)': h.hour,
    'Timestamp (UTC)': h.timestamp,
    'CPU Usage (%)': h.cpuUsage,
    'RAM Usage (%)': h.ramUsage,
    'Disk Usage (%)': h.diskUsage,
    'Disk I/O Reads (MB/s)': h.diskIoReads,
    'Disk I/O Writes (MB/s)': h.diskIoWrites,
  }));
  const wsHourly = XLSX.utils.json_to_sheet(hourlyRows);
  XLSX.utils.book_append_sheet(wb, wsHourly, 'Hourly Telemetry');

  // 2. Top Resource Consumers
  const topRows = topServers.map(s => ({
    Rank: s.rank,
    'Node ID': s.nodeId,
    'Hostname': s.hostname,
    'IP Address': s.ip,
    'Metric Type': s.metricType,
    Value: s.value,
    Unit: s.unit,
    'Peak Hour': s.peakHour,
  }));
  const wsTop = XLSX.utils.json_to_sheet(topRows);
  XLSX.utils.book_append_sheet(wb, wsTop, 'Top Resource Consumers');

  // 3. Peak Runtime Thresholds
  const peakRows = peakRuntimes.map(p => ({
    Metric: p.metric,
    'Current Peak': p.currentPeak,
    'Highest All-Time': p.highestAllTime,
    Unit: p.unit,
    Status: p.status.toUpperCase(),
    'Threshold Limit': p.threshold,
  }));
  const wsPeak = XLSX.utils.json_to_sheet(peakRows);
  XLSX.utils.book_append_sheet(wb, wsPeak, 'Peak Runtime Analysis');

  // 4. SLA Availability Records
  const slaRows = slaRecords.map(s => ({
    Period: s.period,
    Stream: s.stream.toUpperCase(),
    'Target SLA (%)': s.targetPercentage,
    'Achieved SLA (%)': s.achievedPercentage,
    'Outage (Minutes)': s.outageMinutes,
    'Delta H-(H-1) (%)': s.deltaPrev,
    Status: s.status.toUpperCase(),
  }));
  const wsSla = XLSX.utils.json_to_sheet(slaRows);
  XLSX.utils.book_append_sheet(wb, wsSla, 'SLA Availability');

  // Write file
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `NetPulse_Telemetry_Report_${serverIp}_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
}

