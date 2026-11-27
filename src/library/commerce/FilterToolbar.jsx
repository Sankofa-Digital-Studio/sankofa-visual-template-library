import React, { useId, useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * FilterToolbar
 * Adapted from senatla-ops-internal-automation-solution (`ErpFilterToolbarComponent`).
 * Responsive search and category/status filter bar with conditional reset control and optional trailing actions.
 */
export function FilterToolbar({
  placeholder = 'Search records…',
  searchLabel = 'Search',
  filterLabel = 'All statuses',
  filterAriaLabel = 'Filter category',
  filterOptions = [],
  search: controlledSearch,
  selectedFilter: controlledFilter,
  onFilterChange,
  resultCount,
  children,
  className = '',
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [localFilter, setLocalFilter] = useState('');
  const searchId = useId();
  const filterId = useId();

  const searchValue =
    controlledSearch !== undefined
      ? (controlledSearch == null ? '' : String(controlledSearch))
      : localSearch;
  const filterValue =
    controlledFilter !== undefined
      ? (controlledFilter == null ? '' : String(controlledFilter))
      : localFilter;
  const hasActiveFilters = searchValue.trim().length > 0 || filterValue.length > 0;

  const normalizedOptions = Array.isArray(filterOptions)
    ? filterOptions
        .filter((opt) => opt !== null && opt !== undefined)
        .map((opt) =>
          typeof opt === 'string' || typeof opt === 'number'
            ? { label: String(opt), value: String(opt) }
            : opt,
        )
        .filter(
          (opt) =>
            opt &&
            opt.value !== undefined &&
            opt.value !== null &&
            opt.label !== undefined &&
            opt.label !== null,
        )
        .map((opt) => ({ ...opt, value: String(opt.value) }))
    : [];

  const emitChange = (nextSearch, nextFilter) => {
    if (controlledSearch === undefined) setLocalSearch(nextSearch);
    if (controlledFilter === undefined) setLocalFilter(nextFilter);
    onFilterChange?.({ search: nextSearch, selectedFilter: nextFilter });
  };

  const clearFilters = () => emitChange('', '');
  const parsedResultCount =
    typeof resultCount === 'number'
      ? (Number.isFinite(resultCount) ? resultCount : null)
      : typeof resultCount === 'string' && resultCount.trim() !== '' && Number.isFinite(Number(resultCount))
        ? Number(resultCount)
        : null;

  return (
    <div
      role="search"
      aria-label={searchLabel}
      className={`flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="relative flex-1 min-w-0">
        <label htmlFor={searchId} className="sr-only">
          {searchLabel}
        </label>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={searchId}
          type="search"
          value={searchValue}
          placeholder={placeholder}
          onChange={(event) => emitChange(event.target.value, filterValue)}
          className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {normalizedOptions.length > 0 && (
          <div className="min-w-0">
            <label htmlFor={filterId} className="sr-only">
              {filterAriaLabel}
            </label>
            <select
              id={filterId}
              value={filterValue}
              aria-label={filterAriaLabel}
              onChange={(event) => emitChange(searchValue, event.target.value)}
              className="min-h-11 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            >
              <option value="">{filterLabel}</option>
              {normalizedOptions.map((opt, idx) => (
                <option key={`${opt.value}-${idx}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X size={14} aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}

        {parsedResultCount !== null && (
          <span role="status" className="px-2 text-xs text-slate-400">
            {parsedResultCount} {parsedResultCount === 1 ? 'result' : 'results'}
          </span>
        )}

        {children}
      </div>
    </div>
  );
}

export default FilterToolbar;
