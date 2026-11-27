import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

function sanitizeHref(href) {
  if (typeof href !== 'string') return '';
  const trimmed = href.trim();
  if (!trimmed || /^(javascript|vbscript|data):/i.test(trimmed)) return '';
  return trimmed;
}

const TONE_MAP = {
  neutral: {
    border: 'border-slate-700 bg-slate-900/80',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    Icon: Info,
    iconClass: 'text-slate-400',
    btn: 'bg-slate-800 hover:bg-slate-700 text-white',
  },
  success: {
    border: 'border-emerald-500/40 bg-emerald-950/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Icon: CheckCircle,
    iconClass: 'text-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
  },
  warning: {
    border: 'border-amber-500/40 bg-amber-950/20',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Icon: AlertTriangle,
    iconClass: 'text-amber-400',
    btn: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
  },
  danger: {
    border: 'border-red-500/40 bg-red-950/20',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    Icon: AlertCircle,
    iconClass: 'text-red-400',
    btn: 'bg-red-500 hover:bg-red-400 text-white',
  },
};

/**
 * WorkspaceActionStrip
 * Adapted from senatla-ops-internal-automation-solution workspace-action-strip.component.ts.
 * Banner guiding operators to the next safe action with tone-coded border and live-region status.
 */
export function WorkspaceActionStrip({
  eyebrow = 'Next Safe Action',
  title = 'Shift attendance records ready for supervisor sign-off',
  detail = 'All 14 active site workers have checked in or recorded excused absence. Ready to sign and submit timesheet.',
  stateLabel = 'Pending Review',
  actionLabel = 'Review and Sign Timesheet',
  actionDisabled = false,
  actionHref,
  tone = 'warning',
  onAction,
  className = '',
}) {
  const toneConfig = TONE_MAP[tone] || TONE_MAP.neutral;
  const { Icon } = toneConfig;
  const safeActionHref = sanitizeHref(actionHref);

  return (
    <section
      className={`rounded-2xl border p-4 shadow-lg transition-all sm:p-5 ${toneConfig.border} ${className}`}
      aria-label="Workspace next action strip"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon size={16} className={toneConfig.iconClass} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
            {title}
          </h2>
          {detail && (
            <p className="max-w-2xl text-xs leading-relaxed text-slate-300">
              {detail}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {stateLabel && (
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneConfig.badge}`}
              role="status"
              aria-live="polite"
            >
              {stateLabel}
            </span>
          )}

          {actionLabel && (
            safeActionHref && !actionDisabled ? (
              <a
                href={safeActionHref}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${toneConfig.btn}`}
              >
                <span>{actionLabel}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                disabled={actionDisabled}
                onClick={onAction}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${toneConfig.btn}`}
              >
                <span>{actionLabel}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default WorkspaceActionStrip;
