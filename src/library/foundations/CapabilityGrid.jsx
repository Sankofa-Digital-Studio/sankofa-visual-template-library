import React from 'react';

const DEFAULT_CAPABILITIES = [
  { number: '01', title: 'Systems Analysis', description: 'Connects business objectives with technical architecture, operational workflows, and delivery constraints.', tag: 'Analysis' },
  { number: '02', title: 'Software Engineering', description: 'Builds front-end and full-stack solutions using modern application architecture, Git-based CI/CD, and testing practices.', tag: 'Engineering' },
  { number: '03', title: 'Data & Automation', description: 'Works with data quality, measurement, traceability, and workflows to improve operational consistency.', tag: 'Automation' },
  { number: '04', title: 'Learning Systems', description: 'Designs diagnostic assessments, practice exercises, and structured remediation around specific needs.', tag: 'Education' },
  { number: '05', title: 'Technical Communication', description: 'Makes complex systems accessible through clear requirements, architecture docs, and transparent reasoning.', tag: 'Communication' },
  { number: '06', title: 'Reflective Delivery', description: 'Uses continuous review, smoke tests, and critical evaluation to refine methods and improve subsequent outputs.', tag: 'Quality' },
];

const COLUMN_CLASSES = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

/**
 * CapabilityGrid
 * Adapted from sankofa-digital-za systems profile and service capabilities.
 * Structured grid showcasing organizational or system strengths with numeric sequencing.
 */
export function CapabilityGrid({
  capabilities = DEFAULT_CAPABILITIES,
  columns = 3,
  emptyLabel = 'No capabilities listed.',
  ariaLabel = 'Capabilities grid',
  className = '',
}) {
  const safeCapabilities = Array.isArray(capabilities) ? capabilities.filter(Boolean) : [];
  if (safeCapabilities.length === 0) {
    return (
      <p role="status" className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400 ${className}`}>
        {emptyLabel}
      </p>
    );
  }

  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];

  return (
    <div className={`grid ${colClass} gap-4 sm:gap-5 ${className}`} aria-label={ariaLabel}>
      {safeCapabilities.map((cap, idx) => {
        const number = cap.number || String(idx + 1).padStart(2, '0');
        return (
          <article
            key={cap.id || `${number}-${cap.title || idx}`}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 transition-all hover:border-slate-700 hover:bg-slate-900/80"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-bold text-amber-400">
                  {number}
                </span>
                {cap.tag && (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {cap.tag}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold tracking-tight text-white">{cap.title}</h3>
              {cap.description && (
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{cap.description}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default CapabilityGrid;
