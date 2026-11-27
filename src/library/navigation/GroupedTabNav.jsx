import React, { useMemo, useRef } from 'react';

/**
 * GroupedTabNav
 * Adapted from senatla-ops-internal-automation-solution (`UiTabNavComponent`).
 * Grouped horizontal section navigation bar with `aria-current="page"`, disabled state, and keyboard arrow traversal.
 */
export function GroupedTabNav({
  tabs = [],
  activeId = '',
  ariaLabel = 'Workspace sections',
  onSelect,
  className = '',
}) {
  const buttonRefs = useRef(new Map());

  const safeTabs = useMemo(
    () =>
      Array.isArray(tabs)
        ? tabs.filter(
            (t) =>
              t &&
              t.id !== undefined &&
              t.id !== null &&
              t.id !== '' &&
              t.label !== undefined &&
              t.label !== null &&
              t.label !== '',
          )
        : [],
    [tabs],
  );

  const groupedTabs = useMemo(() => {
    const groups = new Map();
    for (const tab of safeTabs) {
      const key = tab.group || '';
      groups.set(key, [...(groups.get(key) || []), tab]);
    }
    return [...groups.entries()].map(([label, items]) => ({ label, tabs: items }));
  }, [safeTabs]);

  const handleKeyDown = (event, currentId) => {
    const enabledTabs = safeTabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === currentId);
    if (currentIndex === -1) return;

    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabledTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + enabledTabs.length - 1) % enabledTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabledTabs.length - 1;
    else return;

    event.preventDefault();
    const targetTab = enabledTabs[nextIndex];
    onSelect?.(targetTab.id);
    buttonRefs.current.get(targetTab.id)?.focus();
  };

  if (safeTabs.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex gap-4 overflow-x-auto pb-2 pt-0.5 ${className}`}
    >
      {groupedTabs.map((group, groupIdx) => (
        <div key={group.label || `group-${groupIdx}`} className="shrink-0">
          {group.label && (
            <span className="mb-1.5 ml-0.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
              {group.label}
            </span>
          )}
          <div className="flex gap-1.5">
            {group.tabs.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    if (node) buttonRefs.current.set(tab.id, node);
                    else buttonRefs.current.delete(tab.id);
                  }}
                  type="button"
                  data-tab-id={tab.id}
                  aria-current={isActive ? 'page' : undefined}
                  disabled={Boolean(tab.disabled)}
                  onClick={() => onSelect?.(tab.id)}
                  onKeyDown={(event) => handleKeyDown(event, tab.id)}
                  className={`min-h-11 min-w-[7.25rem] rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-sm'
                      : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default GroupedTabNav;
