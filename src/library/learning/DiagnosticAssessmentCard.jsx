import React, { useId, useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const DEFAULT_QUESTION = {
  id: 'diag-1',
  prompt: 'When formatting financial statements in Excel, which action ensures formula recalculation when interest rates change dynamically?',
  options: [
    'Hardcode the calculated rate value directly inside the PMT formula string',
    'Reference an external input cell containing the interest rate and ensure consistent annual/monthly periods',
    'Format the cell background in yellow and re-enter values manually',
    'Merge the principal and rate cells to combine data values',
  ],
  correct: 1,
  rationale: 'Referencing a distinct input cell keeps the formula dynamic, separating data assumptions from calculation logic and preventing recalculation bugs.',
};

/**
 * Pure diagnostic state label helper adapted from sankofa-computelab (`src/diagnostic-action.js`).
 */
export function getDiagnosticActionLabel(run) {
  if (run?.submitted) return 'Review diagnostic feedback';
  if (
    (run?.answer !== null && run?.answer !== undefined) ||
    Object.keys(run?.answers ?? {}).length > 0 ||
    Boolean(run?.confidence && (typeof run.confidence === 'string' || Object.keys(run.confidence).length > 0))
  ) {
    return 'Resume diagnostic';
  }
  return 'Start diagnostic';
}

function DiagnosticAssessmentCardBody({ question, onComplete, onReset, className }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const instanceId = useId();

  const options = Array.isArray(question?.options) ? question.options : [];
  if (!question || options.length === 0) {
    return (
      <p role="status" className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400 ${className}`}>
        No diagnostic question options available.
      </p>
    );
  }

  const handleSubmit = () => {
    if (selectedOption === null || !confidence) return;
    setSubmitted(true);
    onComplete?.({
      answer: selectedOption,
      confidence,
      isCorrect: selectedOption === question.correct,
    });
  };

  const handleRetake = () => {
    setSelectedOption(null);
    setConfidence('');
    setSubmitted(false);
    onReset?.();
  };

  const isCorrect = selectedOption === question.correct;
  const isOverconfident = !isCorrect && confidence === 'certain';
  const statusLabel = getDiagnosticActionLabel({
    submitted,
    answer: selectedOption,
    confidence,
  });

  return (
    <article
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg sm:p-6 ${className}`}
      aria-label="Diagnostic question"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="shrink-0 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400">
            <HelpCircle size={18} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Diagnostic Check · {statusLabel}
            </span>
            <h3 className="mt-0.5 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
              {question.prompt}
            </h3>
          </div>
        </div>
      </div>

      <fieldset className="mb-5 space-y-2 border-0 p-0">
        <legend className="sr-only">{question.prompt}</legend>
        {options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let optionBorder = 'border-slate-800 bg-slate-950/60 text-slate-300';
          if (submitted) {
            if (idx === question.correct) {
              optionBorder = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200';
            } else if (isSelected) {
              optionBorder = 'border-red-500/50 bg-red-950/30 text-red-200';
            }
          } else if (isSelected) {
            optionBorder = 'border-amber-400 bg-amber-500/10 text-white';
          }

          return (
            <label
              key={`${question.id || 'q'}-${idx}`}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all sm:p-3.5 ${optionBorder}`}
            >
              <input
                type="radio"
                name={`diag-${question.id || 'question'}-${instanceId}`}
                disabled={submitted}
                checked={isSelected}
                onChange={() => setSelectedOption(idx)}
                className="mt-0.5 text-amber-500 focus:ring-amber-400"
              />
              <span className="leading-relaxed">{opt}</span>
            </label>
          );
        })}
      </fieldset>

      {!submitted ? (
        <div className="flex flex-col justify-between gap-3 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-medium text-slate-400">Confidence:</span>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Select confidence</option>
              <option value="unsure">Unsure (Guessing)</option>
              <option value="likely">Likely (Reasoned)</option>
              <option value="certain">Certain (Confirmed)</option>
            </select>
          </label>

          <button
            type="button"
            disabled={selectedOption === null || !confidence}
            onClick={handleSubmit}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Submit &amp; Reveal</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="space-y-3 border-t border-slate-800/80 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle size={15} aria-hidden="true" /> Correct
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-400">
                  <XCircle size={15} aria-hidden="true" /> Review Needed
                </span>
              )}
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">
                Confidence was: <strong className="capitalize text-slate-200">{confidence}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Try again</span>
            </button>
          </div>

          {isOverconfident && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-300"
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Overconfident Error: You marked this answer &ldquo;Certain&rdquo;, but missed the core concept. Review the rationale below.
              </span>
            </div>
          )}

          {question.rationale && (
            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-white">Rationale:</span>
              <p className="leading-relaxed">{question.rationale}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * DiagnosticAssessmentCard
 * Adapted from sankofa-computelab formative diagnostic assessment flow.
 * Formative question card with confidence calibration, accessible fieldset semantics, overconfidence alert, and rationale reveal.
 */
export function DiagnosticAssessmentCard({
  question = DEFAULT_QUESTION,
  onComplete,
  onReset,
  className = '',
}) {
  return (
    <DiagnosticAssessmentCardBody
      key={question?.id ?? question?.prompt ?? 'default'}
      question={question}
      onComplete={onComplete}
      onReset={onReset}
      className={className}
    />
  );
}

export default DiagnosticAssessmentCard;
