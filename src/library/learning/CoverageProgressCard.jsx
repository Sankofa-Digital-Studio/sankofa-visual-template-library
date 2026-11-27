import React from 'react';
import { ArrowRight } from 'lucide-react';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * CoverageProgressCard
 * Adapted from sankofa-computelab mastery progress indicator.
 * Visual ring gauge showing completion coverage with clamped percentage, progressbar semantics, and action links.
 */
export function CoverageProgressCard({
  title = 'Practice Coverage',
  completed = 18,
  total = 42,
  unit = 'tasks completed',
  actions = [
    { label: 'Scores & weak areas', count: null, onClick: () => {} },
    { label: 'Bookmarked questions', count: 5, onClick: () => {} },
  ],
  className = '',
}) {
  const safeTotal = Number.isFinite(Number(total)) && Number(total) > 0 ? Number(total) : 0;
  const parsedCompleted =
    completed === null || completed === undefined || completed === '' ? 0 : Number(completed);
  const rawCompleted = Number.isFinite(parsedCompleted) ? parsedCompleted : 0;
  const safeCompleted = safeTotal > 0 ? Math.max(0, Math.min(safeTotal, rawCompleted)) : 0;
  const percent = safeTotal > 0 ? Math.max(0, Math.min(100, Math.round((safeCompleted / safeTotal) * 100))) : 0;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * percent) / 100;
  const statusLabel = percent >= 80 ? 'Well prepared' : percent >= 40 ? 'In progress' : 'Getting started';
  const statusClass = percent >= 80 ? 'text-emerald-400' : percent >= 40 ? 'text-amber-400' : 'text-slate-400';
  const safeActions = Array.isArray(actions) ? actions.filter(Boolean) : [];

  return (
    <article
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm sm:p-6 ${className}`}
      aria-label="Practice coverage summary"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-4">
          <div
            role="progressbar"
            aria-label={title}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center"
          >
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-amber-400 transition-all duration-500 ease-out"
                strokeWidth="10"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-white">{percent}%</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{safeCompleted}</span> of{' '}
              <span className="font-semibold text-slate-200">{safeTotal}</span> {unit}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
          <span className={`text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>

      {safeActions.length > 0 && (
        <div className="mt-4 space-y-2">
          {safeActions.map((act, i) => (
            <button
              key={act.id || act.label || i}
              type="button"
              onClick={act.onClick}
              className="group flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="flex items-center gap-2">
                <span>{act.label}</span>
                {act.count !== null && act.count !== undefined && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    {act.count}
                  </span>
                )}
              </span>
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:text-amber-400"
              />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export default CoverageProgressCard;
