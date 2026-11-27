import React, { useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

function sanitizeHref(href) {
  if (typeof href !== 'string') return '';
  const trimmed = href.trim();
  if (!trimmed) return '';
  if (/^(javascript|vbscript|data):/i.test(trimmed)) return '';
  return trimmed;
}

const DEFAULT_STAGES = [
  {
    id: 'discover',
    tabLabel: 'Discover',
    stepLabel: '01 / Discover',
    status: 'Current state →',
    title: 'Start with the current state.',
    copy: 'We map what is really happening: the handoffs, workarounds and quiet dependencies that a requirements document usually misses.',
    coreTitle: 'Your workflow',
    coreNote: 'the real starting point',
    activeNodes: [],
    activeSatellites: [],
  },
  {
    id: 'build',
    tabLabel: 'Build',
    stepLabel: '02 / Build',
    status: 'Focused product →',
    title: 'Turn insight into a useful increment.',
    copy: 'The product follows the shape of the work: focused enough to use now, structured enough to grow when the next constraint appears.',
    coreTitle: 'The right product',
    coreNote: 'shaped around reality',
    activeNodes: ['people', 'decisions'],
    activeSatellites: ['constraints'],
  },
  {
    id: 'handover',
    tabLabel: 'Handover',
    stepLabel: '03 / Handover',
    status: 'Owned by you →',
    title: 'Leave the system stronger than you found it.',
    copy: 'A clear handover includes working software, known limits and the decisions your team needs to keep moving with confidence.',
    coreTitle: 'Your next step',
    coreNote: 'clear enough to own',
    activeNodes: ['evidence'],
    activeSatellites: ['handover'],
  },
];

const DEFAULT_NODES = [
  { id: 'people', index: '01', label: 'People', note: 'who carries the work' },
  { id: 'decisions', index: '02', label: 'Decisions', note: 'where judgement lives' },
  { id: 'evidence', index: '03', label: 'Evidence', note: 'what must be trusted' },
];

const DEFAULT_SATELLITES = [
  { id: 'constraints', label: 'Local constraints' },
  { id: 'handover', label: 'Clear handover' },
];

/**
 * WorkflowSystemMap
 * Adapted from sankofa-digital-za (`origin/dev` system-map section).
 * Interactive 3-stage orbital system architecture map with accessible tablist controls and keyboard navigation.
 */
export function WorkflowSystemMap({
  kicker = 'Workflow map',
  stages = DEFAULT_STAGES,
  nodes = DEFAULT_NODES,
  satellites = DEFAULT_SATELLITES,
  initialStageId,
  actionLabel = 'See the delivery process',
  actionHref,
  onAction,
  className = '',
}) {
  const filteredStages = Array.isArray(stages) ? stages.filter(Boolean) : [];
  const safeStages = (filteredStages.length > 0 ? filteredStages : DEFAULT_STAGES).map((stage, idx) => ({
    ...stage,
    id: stage.id !== undefined && stage.id !== null && stage.id !== '' ? stage.id : `stage-${idx}`,
  }));
  const safeNodes = Array.isArray(nodes) ? nodes.filter(Boolean) : [];
  const safeSatellites = Array.isArray(satellites) ? satellites.filter(Boolean) : [];
  const [activeId, setActiveId] = useState(initialStageId ?? safeStages[0].id);
  const tabRefs = useRef(new Map());
  const instanceId = useId();
  const safeActionHref = sanitizeHref(actionHref);

  const currentStage = safeStages.find((s) => s.id === activeId) || safeStages[0];
  const activeNodes = new Set(currentStage.activeNodes || []);
  const activeSatellites = new Set(currentStage.activeSatellites || []);

  const handleTabKeyDown = (event, index) => {
    let targetIndex;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % safeStages.length;
    else if (event.key === 'ArrowLeft') targetIndex = (index + safeStages.length - 1) % safeStages.length;
    else if (event.key === 'Home') targetIndex = 0;
    else if (event.key === 'End') targetIndex = safeStages.length - 1;
    else return;

    event.preventDefault();
    const nextStage = safeStages[targetIndex];
    setActiveId(nextStage.id);
    tabRefs.current.get(nextStage.id)?.focus();
  };

  return (
    <section
      data-step={currentStage.id}
      aria-label="Interactive workflow system map"
      className={`overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/70 px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">
        <span className="text-amber-400">
          {kicker} / {String(safeStages.length).padStart(2, '0')} stages
        </span>
        <span role="status" aria-live="polite" className="text-slate-300">
          {currentStage.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* Visual Orbital Stage */}
        <div
          className="relative flex min-h-[340px] flex-col justify-between overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.14),transparent_42%),linear-gradient(135deg,#0f172a,#090d16)] p-5 sm:p-7 lg:border-b-0 lg:border-r"
          aria-label="System map relationships"
        >
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 my-auto">
            {/* Core node */}
            <div className="rounded-2xl border border-amber-400 bg-amber-400 px-5 py-3.5 text-center text-slate-950 shadow-lg shadow-amber-500/20">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">00</span>
              <strong className="mt-0.5 block font-serif text-lg font-bold tracking-tight">
                {currentStage.coreTitle}
              </strong>
              {currentStage.coreNote && (
                <small className="block text-xs font-medium opacity-80">{currentStage.coreNote}</small>
              )}
            </div>

            {/* Orbital nodes */}
            {safeNodes.length > 0 && (
              <div className="grid w-full gap-3 sm:grid-cols-3">
                {safeNodes.map((node, idx) => {
                  const isActive = activeNodes.has(node.id);
                  return (
                    <div
                      key={node.id || idx}
                      data-active={isActive ? 'true' : 'false'}
                      className={`rounded-2xl border p-3.5 transition-all duration-300 ${
                        isActive
                          ? '-translate-y-0.5 border-amber-400 bg-slate-900 text-white shadow-md shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300'
                      }`}
                    >
                      <span className="block text-[10px] font-mono font-bold tracking-wider text-amber-400">
                        {node.index || String(idx + 1).padStart(2, '0')}
                      </span>
                      <strong className="mt-1 block font-serif text-base font-semibold text-white">{node.label}</strong>
                      {node.note && <small className="mt-0.5 block text-xs text-slate-400">{node.note}</small>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {safeSatellites.length > 0 && (
            <div className="relative z-10 mt-5 flex flex-wrap justify-between gap-2 pt-3 border-t border-slate-800/70">
              {safeSatellites.map((sat, idx) => {
                const highlighted = activeSatellites.has(sat.id);
                return (
                  <span
                    key={sat.id || idx}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      highlighted
                        ? 'border-amber-400/70 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    {sat.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Narrative & Stage Controls */}
        <div
          id={`${instanceId}-panel-${currentStage.id}`}
          role="tabpanel"
          aria-labelledby={`${instanceId}-tab-${currentStage.id}`}
          tabIndex={0}
          className="flex flex-col justify-center p-6 sm:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {currentStage.stepLabel}
          </span>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {currentStage.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{currentStage.copy}</p>

          <div
            role="tablist"
            aria-label="System map stages"
            className="mt-6 flex flex-wrap gap-2"
          >
            {safeStages.map((stage, index) => {
              const selected = stage.id === currentStage.id;
              return (
                <button
                  key={stage.id}
                  ref={(node) => {
                    if (node) tabRefs.current.set(stage.id, node);
                    else tabRefs.current.delete(stage.id);
                  }}
                  id={`${instanceId}-tab-${stage.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${instanceId}-panel-${stage.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(stage.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    selected
                      ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-sm'
                      : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {stage.tabLabel || stage.title || stage.stepLabel || `Stage ${index + 1}`}
                </button>
              );
            })}
          </div>

          {(safeActionHref || onAction) && (
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              {safeActionHref ? (
                <a
                  href={safeActionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  <span>{actionLabel}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onAction(currentStage)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  <span>{actionLabel}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSystemMap;
