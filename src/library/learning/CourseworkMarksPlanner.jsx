import React, { useMemo, useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

const DEFAULT_TASKS = [
  { id: 'assign', label: 'Assignment', max: 100, weight: 20 },
  { id: 'test1', label: 'Test 1', max: 50, weight: 30 },
  { id: 'exam', label: 'Internal Exam', max: 100, weight: 50 },
];

function normalizeValues(tasks, initialValues) {
  return tasks.map((_, idx) => {
    const val = Array.isArray(initialValues) ? initialValues[idx] : '';
    return val === undefined || val === null ? '' : String(val);
  });
}

function CourseworkMarksPlannerBody({
  title,
  description,
  targetPercent,
  safeTasks,
  initialValues,
  controlledValues,
  onValuesChange,
  className,
}) {
  const [values, setValues] = useState(() => normalizeValues(safeTasks, initialValues));
  const isControlled = controlledValues !== undefined;

  const currentValues = useMemo(
    () =>
      isControlled
        ? normalizeValues(safeTasks, controlledValues)
        : safeTasks.map((_, idx) => (values[idx] === undefined ? '' : values[idx])),
    [isControlled, controlledValues, safeTasks, values],
  );

  const safeTarget = Number.isFinite(Number(targetPercent))
    ? Math.max(0, Math.min(100, Number(targetPercent)))
    : 40;

  const handleInputChange = (idx, val) => {
    const updated = [...currentValues];
    updated[idx] = val;
    if (!isControlled) setValues(updated);
    onValuesChange?.(updated);
  };

  const handleReset = () => {
    const cleared = safeTasks.map(() => '');
    if (!isControlled) setValues(cleared);
    onValuesChange?.(cleared);
  };

  const plan = useMemo(() => {
    let secured = 0;
    let recordedWeight = 0;
    let totalWeight = 0;
    const invalidIndices = new Set();

    safeTasks.forEach((task, idx) => {
      const weight = Math.max(0, Number(task.weight) || 0);
      const max = Number(task.max) || 0;
      totalWeight += weight;

      const raw = currentValues[idx];
      const trimmed = raw === null || raw === undefined ? '' : String(raw).trim();
      if (trimmed !== '') {
        const num = Number(trimmed);
        if (!Number.isFinite(num) || num < 0 || max <= 0 || num > max) {
          invalidIndices.add(idx);
        } else {
          secured += (num / max) * weight;
          recordedWeight += weight;
        }
      }
    });

    const isValid = invalidIndices.size === 0;
    const remainingWeight = Math.max(0, totalWeight - recordedWeight);
    const needed = safeTarget - secured;
    const requiredPercentOnRemaining =
      remainingWeight > 0 ? (needed / remainingWeight) * 100 : null;
    const reachable =
      needed <= 0 || (remainingWeight > 0 && requiredPercentOnRemaining <= 100);
    const progressDenominator = totalWeight > 0 ? totalWeight : 100;

    return {
      secured,
      totalWeight,
      progressDenominator,
      recordedWeight,
      remainingWeight,
      needed,
      requiredPercentOnRemaining,
      reachable,
      invalidIndices,
      isValid,
      complete: safeTasks.length > 0 && totalWeight > 0 && remainingWeight === 0,
      meetsTarget: totalWeight > 0 && secured >= safeTarget,
      hasInput: currentValues.some((v) => String(v).trim() !== ''),
    };
  }, [safeTasks, currentValues, safeTarget]);

  if (safeTasks.length === 0) {
    return (
      <p role="status" className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400 ${className}`}>
        No assessment tasks configured.
      </p>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg sm:p-6 ${className}`}
      aria-label="Coursework marks planner"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
          <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
        </div>
        {plan.hasInput && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>
      {description && <p className="mb-5 text-xs leading-relaxed text-slate-400">{description}</p>}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {safeTasks.map((task, idx) => {
          const invalid = plan.invalidIndices.has(idx);
          return (
            <label key={task.id || idx} className="block text-xs">
              <span className="mb-1 block font-medium text-slate-300">
                {task.label} <span className="text-slate-400">/ {task.max}</span> ({task.weight}%)
              </span>
              <input
                type="number"
                min="0"
                max={task.max}
                step="0.5"
                placeholder="Pending"
                aria-invalid={invalid || undefined}
                value={currentValues[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className={`min-h-11 w-full rounded-xl border bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  invalid
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-slate-700 focus:border-transparent focus:ring-amber-400'
                }`}
              />
            </label>
          );
        })}
      </div>

      {!plan.isValid ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300"
        >
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          <span>Please enter valid scores between 0 and each assessment task&apos;s maximum marks.</span>
        </div>
      ) : (
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Secured Weighted Points:</span>
            <span className="font-mono text-sm font-bold text-amber-400">
              {plan.secured.toFixed(1)} / {plan.progressDenominator}
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Secured weighted points"
            aria-valuenow={Math.round(plan.secured)}
            aria-valuemin={0}
            aria-valuemax={plan.progressDenominator}
            className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
          >
            <div
              className={`h-full transition-all duration-300 ${plan.meetsTarget ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, Math.max(0, (plan.secured / plan.progressDenominator) * 100))}%` }}
            />
          </div>

          <div role="status" className="flex items-start gap-2 pt-2 text-xs text-slate-300">
            {plan.meetsTarget ? (
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
            ) : (
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
            )}
            <div>
              {plan.totalWeight === 0 ? (
                <span>Assign positive task weights to calculate coursework progress.</span>
              ) : plan.complete ? (
                <span>
                  {plan.meetsTarget
                    ? `Target reached (${plan.secured.toFixed(1)}%). Ready for examination admission.`
                    : 'Total falls below admission target. Contact lecturer for remediation.'}
                </span>
              ) : plan.meetsTarget ? (
                <span>
                  Target already reached ({plan.secured.toFixed(1)}%). {plan.remainingWeight}% weighting remains unrecorded.
                </span>
              ) : plan.reachable && plan.requiredPercentOnRemaining !== null ? (
                <span>
                  Need an average of at least {Math.max(0, Math.ceil(plan.requiredPercentOnRemaining))}% across remaining tasks ({plan.remainingWeight}% weight) to reach the {safeTarget}% target.
                </span>
              ) : (
                <span>
                  Target of {safeTarget}% cannot be reached with the remaining {plan.remainingWeight}% weighting alone.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * CourseworkMarksPlanner
 * Adapted from sankofa-computelab N5 coursework marks planner.
 * Calculates weighted score progress across assessments and projects target scores needed on remaining weighting.
 */
export function CourseworkMarksPlanner({
  title = 'Coursework Planning Estimate',
  description = 'Standard TVET model: Assignment 20%, Test 1 30%, Internal Exam 50%, with a 40% admission planning target.',
  targetPercent = 40,
  tasks = DEFAULT_TASKS,
  initialValues = [],
  values: controlledValues,
  onValuesChange,
  className = '',
}) {
  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks.filter(Boolean) : []), [tasks]);
  const tasksSignature = safeTasks.map((task, idx) => `${task.id ?? idx}:${task.max ?? ''}:${task.weight ?? ''}`).join('|');

  return (
    <CourseworkMarksPlannerBody
      key={tasksSignature}
      title={title}
      description={description}
      targetPercent={targetPercent}
      safeTasks={safeTasks}
      initialValues={initialValues}
      controlledValues={controlledValues}
      onValuesChange={onValuesChange}
      className={className}
    />
  );
}

export default CourseworkMarksPlanner;
