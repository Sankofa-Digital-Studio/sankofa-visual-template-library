import React from 'react';

const DEFAULT_METRICS = [
  { label: 'Completion', value: '92%', tone: 'accent' },
  { label: 'Total Workers', value: 24, tone: 'neutral' },
  { label: 'Present', value: 22, tone: 'success' },
  { label: 'Absent', value: 1, tone: 'danger' },
  { label: 'Pending', value: 1, tone: 'neutral' },
  { label: 'Flagged', value: 0, tone: 'warning' },
];

const TONE_COLORS = {
  accent: 'text-amber-400',
  success: 'text-emerald-400',
  danger: 'text-rose-400',
  warning: 'text-amber-300',
  neutral: 'text-slate-100',
};

function gridClassForCount(count) {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3';
  if (count === 4) return 'grid-cols-2 lg:grid-cols-4';
  if (count === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
}

/**
 * OperationalMetricStrip
 * Adapted from senatla-ops-internal-automation-solution timesheet-summary.component.ts.
 * High-density multi-cell operational metric bar with semantic definition-list markup and tone-coded values.
 */
export function OperationalMetricStrip({
  metrics = DEFAULT_METRICS,
  compact = false,
  emptyLabel = 'No operational metrics available.',
  ariaLabel = 'Operational metrics summary strip',
  className = '',
}) {
  const safeMetrics = Array.isArray(metrics) ? metrics.filter(Boolean) : [];
  if (safeMetrics.length === 0) {
    return (
      <p role="status" className={`rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 ${className}`}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <dl
      className={`grid ${gridClassForCount(safeMetrics.length)} gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800 shadow-md ${className}`}
      aria-label={ariaLabel}
    >
      {safeMetrics.map((metric, idx) => {
        const colorClass = TONE_COLORS[metric.tone] || TONE_COLORS.neutral;
        return (
          <div
            key={metric.id || metric.label || idx}
            className={`flex flex-col justify-center bg-slate-950 ${compact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'}`}
          >
            <dt className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {metric.label}
            </dt>
            <dd
              className={`mt-1 font-mono font-bold leading-tight ${colorClass} ${
                compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
              }`}
            >
              {metric.value ?? '—'}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export default OperationalMetricStrip;
