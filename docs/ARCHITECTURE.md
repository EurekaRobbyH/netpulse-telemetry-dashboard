# NetPulse &mdash; Architecture & Engineering Documentation

**Author:** Eureka Robby Harianja  
**Project:** NetPulse Infrastructure & SLA Observability Suite  
**Stack:** React 18 &bull; Next.js / Vite &bull; TypeScript &bull; Recharts &bull; Tailwind CSS &bull; SheetJS (`xlsx`) &bull; Vitest  

---

## 1. PRD &mdash; Product Requirement Documentation

### 1.1 Problem Statement
Telecommunication network operations centers (NOC) monitor hundreds of edge nodes, API gateways, database clusters, and telemetry collectors. Operators face significant friction when analyzing disjointed metric silos, tracking contractual Service Level Agreements (SLA), and exporting auditable reports for enterprise stakeholders.

### 1.2 Target Audience & Personas
- **NOC Incident Engineers:** Require instant 24-hour visual trendlines (CPU, RAM, Disk, Disk I/O) to identify peak bottlenecks and server saturation.
- **Service Assurance & SLA Managers:** Require daily, weekly, and monthly availability calculations with period-over-period delta tracking against contractual commitments (e.g. 99.90% SLA).
- **Executive Stakeholders:** Require one-click, formatted Excel (`.xlsx`) workbooks and raw CSV files without running manual SQL queries.

### 1.3 Key Features
- **Server Observability:** Multi-card telemetry views with sliding 24-hour trendlines, top resource consumers by metric type, and peak runtime threshold indicators.
- **SLA Availability Engine:** Dual-stream Southbound (SB) and Northbound (NB) availability analysis, featuring automated period-over-period delta computation ($H - (H-1)$) and threshold reference lines.
- **User Telemetry Auditing:** Auditing operator logins, busy-hour spikes, and top accessed modules.
- **Client-Side Export Utility:** Multi-sheet Excel workbook export and CSV Blob streaming.

---

## 2. TRD &mdash; Technical Requirement Documentation

### 2.1 Technology Stack Rationale
| Layer | Choice | Technical Justification |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Zero-overhead, lightning-fast HMR, and optimal bundle size for client-heavy telemetry views. |
| **Language** | TypeScript (Strict) | Enforces compile-time type safety across time-series metrics, preventing runtime undefined errors in chart rendering. |
| **Styling** | Tailwind CSS v3 | Declarative design tokens, native dark/light mode toggles, and responsive grid layouts. |
| **Charting** | Recharts (SVG Composed) | Declarative SVG rendering with custom gradients, tooltips, and reference lines. |
| **Data Export** | SheetJS (`xlsx`) | Generates structured multi-tab Excel files in memory on the client without backend server round-trips. |
| **Testing** | Vitest | High-speed unit testing for delta calculation logic and data formatters. |

---

## 3. AFD &mdash; Application Flow Documentation

### 3.1 Data Flow Diagram
```
[ Telemetry API / Mock Time-Series Generator ]
                     │
                     ▼
          [ State Store / Slices ]
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
[ Selected Node IP Filter ]   [ Stream & Granularity Toggle ]
      │                             │
      ▼                             ▼
[ 24h Hourly Metric Aggregator ] [ useMemo Period-over-Period Delta ]
      │                             │
      └──────────────┬──────────────┘
                     ▼
      [ Interactive SVG Chart Renderers ]
                     │
                     ▼
       [ Client-Side Export Pipeline ]
       ├── SheetJS (.xlsx Multi-Sheet)
       └── Blob Streamer (.csv)
```

---

## 4. BSD &mdash; Backend Schema Documentation

### 4.1 Hourly Metric Schema
```typescript
interface HourlyServerMetric {
  hour: string;           // "HH:00"
  timestamp: string;      // ISO 8601 UTC
  cpuUsage: number;       // Range: 0.0 - 100.0 (%)
  ramUsage: number;       // Range: 0.0 - 100.0 (%)
  diskUsage: number;      // Range: 0.0 - 100.0 (%)
  diskIoReads: number;    // MB/s
  diskIoWrites: number;   // MB/s
}
```

### 4.2 SLA Record Schema
```typescript
interface SlaRecord {
  period: string;             // "YYYY-MM-DD" | "Wxx-YYYY" | "MMM YYYY"
  targetPercentage: number;   // Contract SLA (e.g. 99.90)
  achievedPercentage: number; // Actual uptime percentage
  outageMinutes: number;      // Calculated downtime in minutes
  stream: "southbound" | "northbound";
  deltaPrev: number;          // Period-over-period delta: H - (H-1)
  status: "met" | "warning" | "breached";
}
```

---

## 5. IPD &mdash; Implementation & Quality Plan

- **Unit Testing:** Comprehensive test coverage via `vitest run` on arithmetic edge cases (e.g., negative delta drops, zero baseline deltas, and floating-point decimal precision).
- **Deployment Strategy:** Configured for one-click static deployment on Vercel, Netlify, or GitHub Pages.

