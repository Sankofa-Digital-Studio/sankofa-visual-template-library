import React from 'react';

const DEFAULT_ROWS = [
  { principle: 'Accessibility', decision: 'Target WCAG 2.2 AA conformance across all public & authenticated surfaces.', verification: 'Keyboard navigation, visible focus indicators, contrast ratios, and screen reader landmarks.' },
  { principle: 'Trust & Restraint', decision: 'No unverified claims or synthetic proof; all metrics trace to audit logs.', verification: 'Customer quotes, case studies, and performance KPIs trace to primary operational data.' },
  { principle: 'Performance & Bandwidth', decision: 'Visual richness with strict budget constraints; progressive enhancement.', verification: 'Core user journeys remain fully functional on 3G connections and with JavaScript disabled.' },
  { principle: 'Privacy & Governance', decision: 'No tracking cookies; qualified enquiries handled via ephemeral or direct channels.', verification: 'Zero marketing trackers, POPIA-compliant legal disclosures, and explicit retention bounds.' },
];

/**
 * PrinciplesMatrix
 * Adapted from sankofa-digital-za WCAG & Architecture decision matrix.
 * Provides an accessible, responsive verification matrix comparing principles, decisions, and release verification checks.
 */
export function PrinciplesMatrix({
  title = 'Design & Engineering Principles Matrix',
  description = 'Clear mapping from foundational standards to operational decisions and verifiable criteria.',
  rows = DEFAULT_ROWS,
  emptyLabel = 'No principle checks documented.',
  className = '',
}) {
  const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];

  return (
    <section className={`space-y-4 ${className}`} aria-label={title || 'Engineering principles matrix'}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>}
          {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
        </div>
      )}

      <div
        role="region"
        aria-label={title || 'Principles matrix table'}
        tabIndex={0}
        className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <caption className="sr-only">{title || 'Engineering principles verification matrix'}</caption>
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th scope="col" className="w-1/4 p-3.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400 sm:p-4">
                Design Principle
              </th>
              <th scope="col" className="w-5/12 p-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300 sm:p-4">
                Architectural Decision
              </th>
              <th scope="col" className="w-1/3 p-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300 sm:p-4">
                Release Check
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {safeRows.length > 0 ? (
              safeRows.map((row, index) => (
                <tr key={row.id || row.principle || index} className="transition-colors hover:bg-slate-900/40">
                  <td className="p-3.5 align-top font-medium text-white sm:p-4">
                    {row.principle}
                  </td>
                  <td className="p-3.5 align-top leading-relaxed text-slate-300 sm:p-4">
                    {row.decision}
                  </td>
                  <td className="p-3.5 align-top font-mono text-[11px] leading-relaxed text-slate-300 sm:p-4">
                    {row.verification}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-6 text-center text-slate-400">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PrinciplesMatrix;
