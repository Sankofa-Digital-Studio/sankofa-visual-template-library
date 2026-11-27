import React, { useId } from 'react';

const TONE_MAP = {
  primary: 'bg-amber-400',
  secondary: 'bg-cyan-400',
  success: 'bg-emerald-400',
  danger: 'bg-rose-500',
  warning: 'bg-amber-300',
};

const HEIGHT_MAP = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
};

function toFiniteNumber(val) {
  if (typeof val !== 'number' && typeof val !== 'string') return null;
  if (typeof val === 'string' && val.trim() === '') return null;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * ProgressBar
 * Adapted from sankofa-water-pwa (`components/ui/progress-bar.tsx`).
 * Accessible horizontal linear progress indicator with clamped bounds, tone presets, and optional percentage readout.
 */
export function ProgressBar({
  label,
  value = 0,
  max = 100,
  tone,
  colorVariant = 'primary',
  showPercent = false,
  size = 'sm',
  ariaLabel = 'Progress',
  className = '',
}) {
  const labelId = useId();
  const parsedMax = toFiniteNumber(max);
  const safeMax = parsedMax !== null && parsedMax > 0 ? parsedMax : 100;
  const parsedValue = toFiniteNumber(value);
  const safeValue = parsedValue !== null ? Math.max(0, Math.min(safeMax, parsedValue)) : 0;
  const pct = Math.max(0, Math.min(100, (safeValue / safeMax) * 100));

  const resolvedTone = tone || colorVariant;
  const barColor = TONE_MAP[resolvedTone] || TONE_MAP.primary;
  const barHeight = HEIGHT_MAP[size] || HEIGHT_MAP.sm;

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label ? (
            <span id={labelId} className="text-xs font-medium text-slate-300">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showPercent && (
            <span className="font-mono text-xs font-semibold text-slate-200">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-800 ${barHeight}`}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
      >
        <div
          className={`${barHeight} ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
