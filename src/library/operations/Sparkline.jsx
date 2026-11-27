import React from 'react';

function toFiniteNumber(val) {
  if (typeof val !== 'number' && typeof val !== 'string') return null;
  if (typeof val === 'string' && val.trim() === '') return null;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Sparkline
 * Adapted from sankofa-water-pwa (`components/ui/sparkline.tsx`).
 * Compact, accessible SVG trend sparkline with automatic bounds, safe numeric sanitization, and customizable stroke coloring.
 */
export function Sparkline({
  values = [],
  data,
  minVal,
  maxVal,
  color = '#fbbf24',
  colorFn,
  width = 120,
  height = 32,
  strokeWidth = 1.75,
  showEndDot = true,
  label = 'Trend sparkline',
  className = '',
}) {
  const source = Array.isArray(data) ? data : values;
  const safeValues = Array.isArray(source)
    ? source.map(toFiniteNumber).filter((v) => v !== null)
    : [];

  const parsedWidth = toFiniteNumber(width);
  const parsedHeight = toFiniteNumber(height);
  const parsedStrokeWidth = toFiniteNumber(strokeWidth);
  const safeWidth = parsedWidth !== null && parsedWidth > 0 ? parsedWidth : 120;
  const safeHeight = parsedHeight !== null && parsedHeight > 0 ? parsedHeight : 32;
  const safeStrokeWidth = parsedStrokeWidth !== null && parsedStrokeWidth > 0 ? parsedStrokeWidth : 1.75;

  if (safeValues.length === 0) {
    return (
      <svg
        width={safeWidth}
        height={safeHeight}
        viewBox={`0 0 ${safeWidth} ${safeHeight}`}
        className={className}
        aria-hidden="true"
      />
    );
  }

  const pad = 3;
  const innerW = Math.max(1, safeWidth - pad * 2);
  const innerH = Math.max(1, safeHeight - pad * 2);

  const parsedMin = toFiniteNumber(minVal);
  const parsedMax = toFiniteNumber(maxVal);
  const computedMin =
    parsedMin !== null ? parsedMin : safeValues.reduce((min, v) => (v < min ? v : min), 0);
  const rawMax =
    parsedMax !== null ? parsedMax : safeValues.reduce((max, v) => (v > max ? v : max), safeValues[0]);
  const computedMax = Math.max(computedMin, rawMax);
  const range = computedMax - computedMin === 0 ? 1 : computedMax - computedMin;

  const points = safeValues.map((v, i) => {
    const x =
      safeValues.length === 1
        ? pad + innerW / 2
        : pad + (i / (safeValues.length - 1)) * innerW;
    const clamped = Math.min(computedMax, Math.max(computedMin, v));
    const y = pad + innerH - ((clamped - computedMin) / range) * innerH;
    return { x, y, v };
  });

  const polyline = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  const lastPoint = points[points.length - 1];
  const strokeColor = typeof colorFn === 'function' ? colorFn(lastPoint.v) || color : color;
  const accessibleLabel = typeof label === 'string' ? label.trim() : '';

  return (
    <svg
      width={safeWidth}
      height={safeHeight}
      viewBox={`0 0 ${safeWidth} ${safeHeight}`}
      className={`overflow-visible ${className}`}
      role={accessibleLabel ? 'img' : undefined}
      aria-label={accessibleLabel || undefined}
      aria-hidden={accessibleLabel ? undefined : 'true'}
    >
      {points.length > 1 && (
        <polyline
          points={polyline}
          fill="none"
          stroke={strokeColor}
          strokeWidth={safeStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      )}
      {showEndDot && (
        <circle cx={lastPoint.x} cy={lastPoint.y} r={2.75} fill={strokeColor} />
      )}
    </svg>
  );
}

export default Sparkline;
