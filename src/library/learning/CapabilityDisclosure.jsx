import React from 'react';
import { ChevronDown, ShieldAlert } from 'lucide-react';

function sanitizeHref(href) {
  if (typeof href !== 'string') return '';
  const trimmed = href.trim();
  if (!trimmed || /^(javascript|vbscript|data):/i.test(trimmed)) return '';
  return trimmed;
}

const DEFAULT_CAPABILITIES = [
  {
    route: 'learning',
    title: 'Course coverage',
    detail: 'Practise selected core skills. Your facilitator can confirm which syllabus outcomes remain.',
  },
  {
    route: 'practice',
    title: 'Marking & rubrics',
    detail: 'Timed quizzes score answers automatically; practical drills use a structured self-marking rubric.',
  },
  {
    route: 'progress',
    title: 'Local device storage',
    detail: 'This browser saves your practice history locally. Moving to another device starts a separate record.',
  },
  {
    route: 'feedback',
    title: 'Facilitator review',
    detail: 'Draft feedback stays on this device until you share an exported summary directly.',
  },
];

/**
 * CapabilityDisclosure
 * Adapted from sankofa-computelab (`origin/main` src/CapabilityDisclosure.jsx & src/capabilities.js).
 * Native `<details>` disclosure panel communicating explicit product scope and capability boundaries.
 */
export function CapabilityDisclosure({
  label = 'What this workspace supports',
  items = DEFAULT_CAPABILITIES,
  defaultOpen = false,
  onNavigate,
  emptyLabel = 'No capability boundaries documented.',
  className = '',
}) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <details
      open={defaultOpen || undefined}
      className={`group rounded-2xl border border-slate-800 bg-slate-900/60 text-sm text-slate-200 shadow-sm ${className}`}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-white transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl">
        <span className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="text-slate-400 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-slate-800/80 px-4 py-4">
        {safeItems.length === 0 ? (
          <p className="text-xs text-slate-400">{emptyLabel}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            {safeItems.map((item, idx) => {
              const rawHref = item.href || (item.route ? `#${item.route}` : '');
              const href = sanitizeHref(rawHref);
              return (
                <div
                  key={item.route || item.title || idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3"
                >
                  <dt className="font-semibold text-amber-300 text-xs">
                    {href ? (
                      <a
                        href={href}
                        onClick={
                          onNavigate
                            ? (event) => {
                                event.preventDefault();
                                onNavigate(item);
                              }
                            : undefined
                        }
                        className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-slate-300">{item.detail}</dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </details>
  );
}

export default CapabilityDisclosure;
