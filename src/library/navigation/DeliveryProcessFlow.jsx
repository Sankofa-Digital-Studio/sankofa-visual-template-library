import React from 'react';

const DEFAULT_STEPS = [
  { number: '01', title: 'Discover', description: 'Current-state map, user needs, operating conditions, and risk boundaries.', deliverables: ['Context map', 'User interviews', 'Risk register'] },
  { number: '02', title: 'Define', description: 'Scope, user journeys, data architecture, and clear acceptance evidence.', deliverables: ['Journey maps', 'System design', 'Deliverable checklist'] },
  { number: '03', title: 'Build', description: 'Working increments, peer reviews, automated verification, and tested behavior.', deliverables: ['Iterative releases', 'Automated tests', 'Review notes'] },
  { number: '04', title: 'Launch', description: 'Runbooks, handover sessions, known limitations, and next iteration backlog.', deliverables: ['Handover guides', 'Runbook', 'Backlog priorities'] },
];

/**
 * DeliveryProcessFlow
 * Adapted from sankofa-digital-za delivery pipeline pattern.
 * Displays sequential delivery stages with automated numbers, description, and key deliverables.
 */
export function DeliveryProcessFlow({
  steps = DEFAULT_STEPS,
  emptyLabel = 'No delivery stages defined.',
  ariaLabel = 'Delivery process workflow',
  className = '',
}) {
  const safeSteps = Array.isArray(steps) ? steps.filter(Boolean) : [];
  if (safeSteps.length === 0) {
    return (
      <p role="status" className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400 ${className}`}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <ol
      className={`grid list-none grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}
      aria-label={ariaLabel}
    >
      {safeSteps.map((step, idx) => {
        const number = step.number || String(idx + 1).padStart(2, '0');
        const deliverables = Array.isArray(step.deliverables) ? step.deliverables.filter(Boolean) : [];
        return (
          <li
            key={step.id || `${number}-${step.title || idx}`}
            className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-md backdrop-blur-sm transition-all hover:border-amber-500/40 hover:bg-slate-900/80"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-bold text-amber-400">
                  {number}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Stage {idx + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold tracking-tight text-white">{step.title}</h3>
              {step.description && (
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{step.description}</p>
              )}
            </div>

            {deliverables.length > 0 && (
              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Deliverables
                </span>
                <ul className="space-y-1">
                  {deliverables.map((item, dIdx) => (
                    <li key={`${dIdx}-${item}`} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default DeliveryProcessFlow;
