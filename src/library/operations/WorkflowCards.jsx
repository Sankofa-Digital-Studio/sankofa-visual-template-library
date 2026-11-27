import React from 'react';
import { ArrowRight, Layers, ShieldCheck, Workflow } from 'lucide-react';

const DEFAULT_STEPS = [
  {
    id: 'capture',
    title: 'Capture Field Record',
    description: 'Log offline readings, observations, or asset inspections with local validation.',
    icon: Layers,
    action: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
        Open capture form <ArrowRight size={13} aria-hidden="true" />
      </span>
    ),
  },
  {
    id: 'verify',
    title: 'Verify & Reconcile',
    description: 'Check anomalies and attach evidence before records move into supervisor review.',
    icon: ShieldCheck,
    action: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
        Inspect queue <ArrowRight size={13} aria-hidden="true" />
      </span>
    ),
  },
  {
    id: 'release',
    title: 'Publish & Handover',
    description: 'Commit approved increments and share an auditable summary with stakeholders.',
    icon: Workflow,
    action: (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
        View release log <ArrowRight size={13} aria-hidden="true" />
      </span>
    ),
  },
];

const COLUMN_CLASSES = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

function isComponentType(value) {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && Boolean(value.$$typeof))
  );
}

/**
 * WorkflowCards
 * Adapted from sankofa-visual-template-library `origin/workflow-cards` (Sankofa Water workflow pattern).
 * Ordered card grid presenting sequential operational or service steps with icon, summary, and action slot.
 */
export function WorkflowCards({
  steps = DEFAULT_STEPS,
  columns = 3,
  showStepNumbers = false,
  emptyLabel = 'No workflow steps configured.',
  ariaLabel = 'Workflow steps',
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

  const gridCols = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];

  return (
    <ol aria-label={ariaLabel} className={`grid list-none gap-4 ${gridCols} ${className}`}>
      {safeSteps.map((step, index) => {
        const iconNode = step.icon;
        const stepNumber = String(index + 1).padStart(2, '0');
        let renderedIcon = null;
        if (React.isValidElement(iconNode)) {
          renderedIcon = iconNode;
        } else if (isComponentType(iconNode)) {
          const IconComponent = iconNode;
          renderedIcon = <IconComponent className="text-amber-400 shrink-0" size={22} aria-hidden="true" />;
        }
        return (
          <li
            key={`${step.id || step.title || 'step'}-${index}`}
            className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md transition-colors hover:border-amber-500/40"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              {renderedIcon || (
                <span className="text-xs font-mono font-bold text-amber-400">{stepNumber}</span>
              )}
              {showStepNumbers && renderedIcon && (
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300">
                  {stepNumber}
                </span>
              )}
            </div>
            {step.title && <h3 className="text-base font-bold text-white tracking-tight">{step.title}</h3>}
            {step.description && (
              <p className="mb-4 mt-2 flex-1 text-sm leading-relaxed text-slate-300">{step.description}</p>
            )}
            {step.action && <div className="mt-auto pt-2">{step.action}</div>}
          </li>
        );
      })}
    </ol>
  );
}

export default WorkflowCards;
