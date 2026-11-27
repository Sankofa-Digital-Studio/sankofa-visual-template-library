import React, { useId, useState } from 'react';
import { Wrench, ChevronDown, ChevronUp, Save, CheckCircle2 } from 'lucide-react';

const DEFAULT_DRILL = {
  id: 'drill-1',
  topic: 'Financial formula units and periodic payments',
  question: 'A client wishes to calculate a monthly loan repayment over 5 years at 12% per annum. What adjustment must be made to the interest rate and period arguments in the PMT formula?',
  rationale: 'In Excel PMT, rate and nper must use the exact same time unit. Divide annual rate by 12 and multiply total loan years by 12.',
  criteria: [
    'Divided the nominal annual rate by 12 for monthly compounding',
    'Multiplied total years by 12 to calculate total periodic payments (nper)',
    'Identified why mismatched units produce erroneous interest calculations',
  ],
};

/**
 * Privacy-safe summary formatter adapted from sankofa-computelab (`src/learning-review.js`).
 * Omits free-text learner reflections and notes when generating a shareable progress check.
 */
export function buildRepairSummary({ topic, satisfiedCount, totalCriteria, completed }) {
  return [
    'Sankofa Repair Studio summary',
    `Topic: ${topic || 'General drill'}`,
    `Criteria demonstrated: ${satisfiedCount} of ${totalCriteria}`,
    `Correction recorded: ${completed ? 'yes' : 'no'}`,
    'Local self-recorded practice. Free-text reflections omitted.',
  ].join('\n');
}

function RepairStudioCardBody({
  drill,
  defaultOpen,
  onSaveCorrection,
  className,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checkedPoints, setCheckedPoints] = useState([]);
  const [correction, setCorrection] = useState('');
  const [saved, setSaved] = useState(false);

  const instanceId = useId();
  const panelId = `${instanceId}-panel`;
  const answerId = `${instanceId}-answer`;
  const correctionId = `${instanceId}-correction`;

  const criteria = Array.isArray(drill?.criteria) ? drill.criteria : [];

  const togglePoint = (idx) => {
    setSaved(false);
    setCheckedPoints((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const handleSave = () => {
    setSaved(true);
    onSaveCorrection?.({
      answer,
      points: checkedPoints,
      correction,
      privacySafeSummary: buildRepairSummary({
        topic: drill?.topic,
        satisfiedCount: checkedPoints.length,
        totalCriteria: criteria.length,
        completed: true,
      }),
    });
  };

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg ${className}`}
      aria-label="Repair studio drill"
    >
      <header className="bg-slate-900/80">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-14 w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 sm:p-5"
        >
          <span className="flex items-center gap-2.5">
            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-amber-400">
              <Wrench size={16} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Targeted Repair
              </span>
              <span className="block text-sm font-semibold tracking-tight text-white">
                {drill?.topic}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            {saved && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Recorded
              </span>
            )}
            {isOpen ? (
              <ChevronUp size={16} className="text-slate-400" aria-hidden="true" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" aria-hidden="true" />
            )}
          </span>
        </button>
      </header>

      {isOpen && (
        <div id={panelId} className="space-y-4 border-t border-slate-800/80 p-5 text-xs sm:p-6">
          <p className="font-medium leading-relaxed text-slate-200">{drill?.question}</p>

          <div>
            <label htmlFor={answerId} className="mb-1 block font-medium text-slate-400">
              Your independent reasoning (draft before revealing criteria):
            </label>
            <textarea
              id={answerId}
              rows={3}
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setSaved(false);
              }}
              placeholder="Explain how you would solve this and why..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {!revealed ? (
            <button
              type="button"
              disabled={!answer.trim()}
              onClick={() => setRevealed(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 font-semibold text-slate-200 transition-all hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Reveal criteria and reasoning</span>
            </button>
          ) : (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              {drill?.rationale && (
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Model Explanation:
                  </span>
                  <p className="leading-relaxed text-slate-300">{drill.rationale}</p>
                </div>
              )}

              {criteria.length > 0 && (
                <fieldset className="border-0 p-0">
                  <legend className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Self-Check Criteria (check only if demonstrated):
                  </legend>
                  <div className="space-y-1.5">
                    {criteria.map((crit, idx) => {
                      const isChecked = checkedPoints.includes(idx);
                      return (
                        <label
                          key={`${drill?.id || 'crit'}-${idx}`}
                          className={`flex min-h-10 cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors ${
                            isChecked ? 'bg-amber-500/10 text-white' : 'text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePoint(idx)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-400 focus:ring-amber-400"
                          />
                          <span className="text-xs leading-snug">{crit}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div>
                <label htmlFor={correctionId} className="mb-1 block font-medium text-slate-400">
                  Changed-facts correction reflection (e.g. quarterly compounding):
                </label>
                <textarea
                  id={correctionId}
                  rows={2}
                  value={correction}
                  onChange={(e) => {
                    setCorrection(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Record what changed and how you verify when conditions shift..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <span role="status" className="text-[11px] text-slate-400">
                  {checkedPoints.length} of {criteria.length} criteria satisfied
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 font-semibold text-slate-950 shadow-sm transition-all hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  {saved ? <CheckCircle2 size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
                  <span>{saved ? 'Saved' : 'Record Correction'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * RepairStudioCard
 * Adapted from sankofa-computelab repair studio.
 * Guided self-assessment drill with accessible accordion header button, checkbox criteria checklist, and changed-facts correction reflection.
 */
export function RepairStudioCard({
  drill = DEFAULT_DRILL,
  defaultOpen = true,
  onSaveCorrection,
  className = '',
}) {
  return (
    <RepairStudioCardBody
      key={drill?.id ?? drill?.topic ?? 'default'}
      drill={drill}
      defaultOpen={defaultOpen}
      onSaveCorrection={onSaveCorrection}
      className={className}
    />
  );
}

export default RepairStudioCard;
