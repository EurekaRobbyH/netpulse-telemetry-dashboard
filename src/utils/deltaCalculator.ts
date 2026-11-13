export interface DeltaResult {
  delta: number;
  formatted: string;
  isPositive: boolean;
  isZero: boolean;
  statusClass: string;
}

export function computePeriodDelta(current: number, previous: number): DeltaResult {
  const delta = Math.round((current - previous) * 100) / 100;
  const isZero = delta === 0;
  const isPositive = delta > 0;
  const sign = isPositive ? '+' : '';
  const formatted = `${sign}${delta.toFixed(2)}%`;

  let statusClass = 'text-slate-400 bg-slate-800/50 border-slate-700';
  if (isPositive) {
    statusClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  } else if (delta < 0) {
    statusClass = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
  }

  return { delta, formatted, isPositive, isZero, statusClass };
}

export function formatPercent(val: number): string {
  return `${val.toFixed(2)}%`;
}

