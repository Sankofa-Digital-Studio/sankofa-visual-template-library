import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const TONE_MAP = {
  default: {
    border: 'border-slate-800 hover:border-slate-700',
    valueColor: 'text-white',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    hintColor: 'text-slate-400 group-hover:text-white',
  },
  accent: {
    border: 'border-amber-500/30 hover:border-amber-400/80 hover:ring-1 hover:ring-amber-400/40',
    valueColor: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    hintColor: 'text-amber-400/90 group-hover:text-amber-300',
  },
  success: {
    border: 'border-emerald-500/30 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40',
    valueColor: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    hintColor: 'text-emerald-400/90 group-hover:text-emerald-300',
  },
  warning: {
    border: 'border-amber-500/30 hover:border-amber-400/80 hover:ring-1 hover:ring-amber-400/40',
    valueColor: 'text-amber-300',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    hintColor: 'text-amber-400/90 group-hover:text-amber-300',
  },
  danger: {
    border: 'border-rose-500/30 hover:border-rose-400/80 hover:ring-1 hover:ring-rose-400/40',
    valueColor: 'text-rose-400',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    hintColor: 'text-rose-400/90 group-hover:text-rose-300',
  },
};

/**
 * InteractiveStatCard
 * Adapted from senatla-ops-internal-automation-solution erp-stat-card.component.ts.
 * Interactive KPI stat card with drilldown trigger, status tone, disabled support, and accessible keyboard activation.
 */
export function InteractiveStatCard({
  title = 'Active Fleet Assets',
  value = '48 / 50',
  subtext = '2 vehicles scheduled for maintenance',
  badge = '96% Operational',
  tone = 'accent',
  interactive = true,
  disabled = false,
  drilldownHint = 'Trace →',
  onClick,
  className = '',
}) {
  const toneConfig = TONE_MAP[tone] || TONE_MAP.default;
  const isActionable = Boolean(interactive && !disabled);

  const handleActivate = () => {
    if (isActionable) onClick?.();
  };

  const handleKeyDown = (e) => {
    if (isActionable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      onClick={isActionable ? handleActivate : undefined}
      onKeyDown={isActionable ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={isActionable ? 0 : undefined}
      aria-disabled={interactive && disabled ? 'true' : undefined}
      aria-label={interactive ? `Inspect drill down for ${title}` : undefined}
      className={`group flex min-h-[140px] flex-col justify-between rounded-2xl border bg-slate-900/60 p-5 transition-all select-none ${
        toneConfig.border
      } ${
        isActionable
          ? 'cursor-pointer hover:shadow-lg hover:shadow-amber-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.99]'
          : disabled
            ? 'cursor-not-allowed opacity-50'
            : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{title}</span>
            {interactive && (
              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="text-amber-400 opacity-60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            )}
          </p>
          <p className={`mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl ${toneConfig.valueColor}`}>
            {value}
          </p>
        </div>

        {badge && (
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${toneConfig.badgeClass}`}>
            {badge}
          </span>
        )}
      </div>

      {(subtext || interactive) && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-2.5 text-xs text-slate-400">
          <span className="truncate">{subtext || ''}</span>
          {interactive && (
            <span className={`shrink-0 text-[10px] font-bold ${toneConfig.hintColor} group-hover:underline`}>
              {drilldownHint}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default InteractiveStatCard;
