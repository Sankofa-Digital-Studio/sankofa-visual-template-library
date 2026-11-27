import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as LibraryRoot from '../index';
import * as FoundationsBarrel from '../foundations';
import * as UiPackage from '../../../packages/ui/index.js';
import {
  WorkflowCards,
  WorkflowSystemMap,
  CapabilityDisclosure,
  FilterToolbar,
  GroupedTabNav,
  DeliveryProcessFlow,
  CapabilityGrid,
  PrinciplesMatrix,
  DirectContactPanel,
  CoverageProgressCard,
  CourseworkMarksPlanner,
  DiagnosticAssessmentCard,
  getDiagnosticActionLabel,
  RepairStudioCard,
  buildRepairSummary,
  WorkspaceActionStrip,
  OperationalMetricStrip,
  InteractiveStatCard,
  SiteFooter,
  ProgressBar,
  Sparkline,
} from '../components';

describe('Library barrel and package exports', () => {
  it('exports all newly added and refactored components from src/library/index.js and packages/ui', () => {
    for (const name of [
      'WorkflowCards',
      'WorkflowSystemMap',
      'CapabilityDisclosure',
      'FilterToolbar',
      'GroupedTabNav',
      'DeliveryProcessFlow',
      'CapabilityGrid',
      'PrinciplesMatrix',
      'DirectContactPanel',
      'CoverageProgressCard',
      'CourseworkMarksPlanner',
      'DiagnosticAssessmentCard',
      'RepairStudioCard',
      'WorkspaceActionStrip',
      'OperationalMetricStrip',
      'InteractiveStatCard',
      'ProductCatalogue',
      'ActionFeedback',
      'ProgressBar',
      'Sparkline',
    ]) {
      expect(LibraryRoot[name]).toBeDefined();
    }

    for (const name of [
      'WorkflowCards',
      'WorkflowSystemMap',
      'CapabilityDisclosure',
      'FilterToolbar',
      'GroupedTabNav',
      'Button',
      'Card',
      'Drawer',
      'ProgressBar',
      'Sparkline',
    ]) {
      expect(UiPackage[name]).toBeDefined();
    }

    expect(FoundationsBarrel.Drawer).toBeDefined();
  });
});

describe('New sibling-repo components', () => {
  it('WorkflowCards renders ordered steps, step numbers, and empty fallback', () => {
    const { rerender } = render(
      <WorkflowCards
        showStepNumbers
        steps={[
          { title: 'Collect', description: 'Gather readings', action: <button type="button">Start</button> },
          { title: 'Submit', description: 'Send batch', action: <button type="button">Send</button> },
        ]}
      />,
    );
    expect(screen.getByRole('list', { name: 'Workflow steps' })).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();

    rerender(<WorkflowCards steps={[]} emptyLabel="Nothing queued." />);
    expect(screen.getByRole('status')).toHaveTextContent('Nothing queued.');
  });

  it('WorkflowSystemMap switches stages on click and keyboard arrow keys', () => {
    const onAction = vi.fn();
    render(<WorkflowSystemMap onAction={onAction} />);
    const discoverTab = screen.getByRole('tab', { name: 'Discover' });
    const buildTab = screen.getByRole('tab', { name: 'Build' });
    const handoverTab = screen.getByRole('tab', { name: 'Handover' });

    expect(discoverTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Current state →');

    fireEvent.click(buildTab);
    expect(buildTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: /turn insight into a useful increment/i })).toBeInTheDocument();

    buildTab.focus();
    fireEvent.keyDown(buildTab, { key: 'ArrowRight' });
    expect(handoverTab).toHaveFocus();
    expect(handoverTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(handoverTab, { key: 'Home' });
    expect(discoverTab).toHaveFocus();
    expect(discoverTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('button', { name: /see the delivery process/i }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'discover' }));
  });

  it('CapabilityDisclosure toggles native details and intercepts navigation when provided', () => {
    const onNavigate = vi.fn();
    render(
      <CapabilityDisclosure
        defaultOpen
        onNavigate={onNavigate}
        items={[
          { route: 'learning', title: 'Course coverage', detail: 'Scoped syllabus drills.' },
          { route: 'progress', title: 'Local progress', detail: 'Stored in browser profile.' },
        ]}
      />,
    );
    expect(screen.getByText('Scoped syllabus drills.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Course coverage' }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ route: 'learning' }));
  });

  it('FilterToolbar supports search, category selection, result count, and clear reset', () => {
    const onFilterChange = vi.fn();
    render(
      <FilterToolbar
        filterOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Archived', value: 'archived' },
        ]}
        onFilterChange={onFilterChange}
        resultCount={1}
      />,
    );

    const search = screen.getByRole('searchbox');
    const select = screen.getByRole('combobox', { name: 'Filter category' });
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('1 result');

    fireEvent.change(search, { target: { value: 'pump' } });
    expect(onFilterChange).toHaveBeenLastCalledWith({ search: 'pump', selectedFilter: '' });

    fireEvent.change(select, { target: { value: 'active' } });
    expect(onFilterChange).toHaveBeenLastCalledWith({ search: 'pump', selectedFilter: 'active' });

    const clearBtn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearBtn);
    expect(onFilterChange).toHaveBeenLastCalledWith({ search: '', selectedFilter: '' });
    expect(search).toHaveValue('');
    expect(select).toHaveValue('');
  });

  it('GroupedTabNav renders grouped sections, skips disabled tabs on keyboard navigation, and marks active page', () => {
    function Harness() {
      const [active, setActive] = useState('overview');
      return (
        <GroupedTabNav
          activeId={active}
          onSelect={setActive}
          tabs={[
            { id: 'overview', label: 'Overview', group: 'Workspace' },
            { id: 'locked', label: 'Locked', group: 'Workspace', disabled: true },
            { id: 'audit', label: 'Audit', group: 'Governance' },
          ]}
        />
      );
    }
    render(<Harness />);
    const overviewBtn = screen.getByRole('button', { name: 'Overview' });
    const lockedBtn = screen.getByRole('button', { name: 'Locked' });
    const auditBtn = screen.getByRole('button', { name: 'Audit' });

    expect(overviewBtn).toHaveAttribute('aria-current', 'page');
    expect(lockedBtn).toBeDisabled();

    overviewBtn.focus();
    fireEvent.keyDown(overviewBtn, { key: 'ArrowRight' });
    expect(auditBtn).toHaveFocus();
    expect(auditBtn).toHaveAttribute('aria-current', 'page');
  });
});

describe('Refactored production edge cases', () => {
  it('DeliveryProcessFlow and CapabilityGrid handle empty states and double-digit step formatting', () => {
    const { rerender } = render(<DeliveryProcessFlow steps={[]} emptyLabel="No stages" />);
    expect(screen.getByRole('status')).toHaveTextContent('No stages');

    const tenSteps = Array.from({ length: 10 }, (_, idx) => ({ title: `Stage ${idx + 1}` }));
    rerender(<DeliveryProcessFlow steps={tenSteps} />);
    expect(screen.getByText('10')).toBeInTheDocument();

    render(<CapabilityGrid capabilities={[]} emptyLabel="No capabilities" />);
    expect(screen.getByText('No capabilities')).toBeInTheDocument();
  });

  it('PrinciplesMatrix renders empty fallback row and sr-only caption', () => {
    render(<PrinciplesMatrix title="Audit Matrix" rows={[]} emptyLabel="No audit rules" />);
    expect(screen.getByText('No audit rules')).toBeInTheDocument();
    expect(screen.getByRole('table')).toContainHTML('<caption class="sr-only">Audit Matrix</caption>');
  });

  it('DirectContactPanel omits invalid channels and supports clipboard fallback', async () => {
    const { rerender } = render(<DirectContactPanel email="not-an-email" whatsappNumber="123" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(/currently unavailable/i)).toBeInTheDocument();

    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    rerender(<DirectContactPanel email="hello@sankofa.co.za" whatsappNumber="" />);
    fireEvent.click(screen.getByRole('button', { name: /copy email address/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied hello@sankofa.co.za'));
    vi.unstubAllGlobals();
  });

  it('CoverageProgressCard clamps negative and overflowing values to 0..100', () => {
    const { rerender } = render(<CoverageProgressCard completed={-10} total={20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<CoverageProgressCard completed={50} total={20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<CoverageProgressCard completed={5} total={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('CourseworkMarksPlanner validates bounds, reports unreachable target, and resets inputs', () => {
    const onValuesChange = vi.fn();
    render(<CourseworkMarksPlanner targetPercent={70} initialValues={['0', '0', '']} onValuesChange={onValuesChange} />);
    expect(screen.getByRole('status')).toHaveTextContent(/cannot be reached/i);

    const assignInput = screen.getByLabelText(/assignment/i);
    fireEvent.change(assignInput, { target: { value: '150' } });
    expect(assignInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent(/valid scores/i);

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(onValuesChange).toHaveBeenLastCalledWith(['', '', '']);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('DiagnosticAssessmentCard exposes helper labels, detects overconfidence, and resets on question change', () => {
    expect(getDiagnosticActionLabel()).toBe('Start diagnostic');
    expect(getDiagnosticActionLabel({ answer: 0 })).toBe('Resume diagnostic');
    expect(getDiagnosticActionLabel({ submitted: true })).toBe('Review diagnostic feedback');

    const q1 = { id: 'q1', prompt: 'Question 1', options: ['Wrong', 'Right'], correct: 1, rationale: 'Because 1' };
    const q2 = { id: 'q2', prompt: 'Question 2', options: ['A', 'B'], correct: 0, rationale: 'Because 0' };
    const { rerender } = render(<DiagnosticAssessmentCard question={q1} />);

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'certain' } });
    fireEvent.click(screen.getByRole('button', { name: /submit & reveal/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/overconfident error/i);
    expect(screen.getByText(/review diagnostic feedback/i)).toBeInTheDocument();

    rerender(<DiagnosticAssessmentCard question={q2} />);
    expect(screen.getByRole('heading', { name: 'Question 2' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getAllByRole('radio')[0]).not.toBeChecked();
  });

  it('RepairStudioCard uses accessible controls and omits free-text notes in privacySafeSummary', () => {
    const summary = buildRepairSummary({ topic: 'PMT Units', satisfiedCount: 2, totalCriteria: 3, completed: true });
    expect(summary).toContain('Criteria demonstrated: 2 of 3');
    expect(summary).toContain('Free-text reflections omitted.');

    const onSaveCorrection = vi.fn();
    render(<RepairStudioCard onSaveCorrection={onSaveCorrection} />);

    const toggle = screen.getByRole('button', { name: /targeted repair/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);

    fireEvent.change(screen.getByPlaceholderText(/explain how you would solve this/i), {
      target: { value: 'PRIVATE_DRAFT_TEXT' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reveal criteria and reasoning/i }));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.change(screen.getByPlaceholderText(/record what changed/i), {
      target: { value: 'PRIVATE_CORRECTION_NOTE' },
    });
    fireEvent.click(screen.getByRole('button', { name: /record correction/i }));

    expect(onSaveCorrection).toHaveBeenCalledWith(
      expect.objectContaining({
        points: [0],
        privacySafeSummary: expect.not.stringContaining('PRIVATE_'),
      }),
    );
  });

  it('WorkspaceActionStrip supports actionHref links and unknown tone fallback', () => {
    render(<WorkspaceActionStrip actionHref="#approve" actionLabel="Open sign-off" tone="unknown" />);
    expect(screen.getByRole('link', { name: /open sign-off/i })).toHaveAttribute('href', '#approve');
  });

  it('OperationalMetricStrip renders empty state and semantic dl/dt/dd structure', () => {
    const { rerender } = render(<OperationalMetricStrip metrics={[]} emptyLabel="No metrics" />);
    expect(screen.getByRole('status')).toHaveTextContent('No metrics');
    rerender(<OperationalMetricStrip metrics={[{ label: 'Ready', value: 4, tone: 'success' }]} />);
    expect(screen.getByText('Ready').tagName).toBe('DT');
    expect(screen.getByText('4').tagName).toBe('DD');
  });

  it('InteractiveStatCard respects disabled state and renders drilldownHint without subtext', () => {
    const onClick = vi.fn();
    render(<InteractiveStatCard title="Disabled KPI" value="0" subtext="" disabled onClick={onClick} />);
    const card = screen.getByRole('button', { name: /inspect drill down for disabled kpi/i });
    expect(card).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Trace →')).toBeInTheDocument();
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('SiteFooter renders multiple links with identical hrefs without React key warnings', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SiteFooter
        groups={[{ label: 'Links', links: [{ label: 'One', href: '#' }, { label: 'Two', href: '#' }] }]}
        legalLinks={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]}
      />,
    );
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles defensive edge cases for GroupedTabNav, WorkflowSystemMap, FilterToolbar, RepairStudioCard, WorkflowCards, and DirectContactPanel', () => {
    // GroupedTabNav with special CSS selector characters in tab IDs
    function SpecialIdNav() {
      const [active, setActive] = useState('ops:overview/1');
      return (
        <GroupedTabNav
          activeId={active}
          onSelect={setActive}
          tabs={[
            { id: 'ops:overview/1', label: 'Overview', group: 'Ops' },
            { id: 'ops:audit/2', label: 'Audit', group: 'Ops' },
          ]}
        />
      );
    }
    const { unmount } = render(<SpecialIdNav />);
    const specialOverview = screen.getByRole('button', { name: 'Overview' });
    specialOverview.focus();
    fireEvent.keyDown(specialOverview, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'Audit' })).toHaveFocus();
    unmount();

    // WorkflowSystemMap with null nodes and satellites
    render(<WorkflowSystemMap nodes={null} satellites={null} />);
    expect(screen.getByRole('tablist', { name: 'System map stages' })).toBeInTheDocument();

    // FilterToolbar with null controlled search and string filterOptions
    const onFilterChange = vi.fn();
    render(<FilterToolbar search={null} filterOptions={['ready', 'blocked']} onFilterChange={onFilterChange} />);
    expect(screen.getByRole('option', { name: 'ready' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'blocked' } });
    expect(onFilterChange).toHaveBeenCalledWith({ search: '', selectedFilter: 'blocked' });

    // RepairStudioCard resets state when drill.id changes
    const d1 = { id: 'd1', topic: 'Drill One', question: 'Q1', rationale: 'R1', criteria: ['C1'] };
    const d2 = { id: 'd2', topic: 'Drill Two', question: 'Q2', rationale: 'R2', criteria: ['C2'] };
    const { rerender } = render(<RepairStudioCard drill={d1} />);
    fireEvent.change(screen.getByPlaceholderText(/explain how you would solve this/i), {
      target: { value: 'Draft one' },
    });
    rerender(<RepairStudioCard drill={d2} />);
    expect(screen.getByPlaceholderText(/explain how you would solve this/i)).toHaveValue('');

    // WorkflowCards accepts a React element as icon
    render(<WorkflowCards steps={[{ title: 'Custom', icon: <span data-testid="custom-icon">*</span> }]} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

    // DirectContactPanel rejects partial email strings like foo@
    render(<DirectContactPanel email="foo@" whatsappNumber="" />);
    expect(screen.getByText(/currently unavailable/i)).toBeInTheDocument();
  });

  it('ProgressBar and Sparkline handle clamping, empty data, colorFn, and accessible semantics', () => {
    const { rerender } = render(<ProgressBar label="Upload" value={150} max={100} showPercent tone="success" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<ProgressBar value={-10} max={0} showPercent colorVariant="danger" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<ProgressBar value={true} max={true} showPercent />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');

    const { container, rerender: rerenderSpark } = render(
      <Sparkline values={[10, 'bad', 25, 40]} colorFn={(v) => (v > 30 ? '#10b981' : '#f59e0b')} label="Load trend" />,
    );
    const svg = screen.getByRole('img', { name: 'Load trend' });
    expect(svg.querySelector('polyline')).toBeTruthy();
    expect(svg.querySelector('polyline')).toHaveAttribute('stroke', '#10b981');
    expect(svg.querySelector('circle')).toBeTruthy();

    rerenderSpark(<Sparkline values={[]} label="Empty trend" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // Auto-bounds must ignore null/"" minVal and maxVal instead of coercing them to 0
    rerenderSpark(<Sparkline values={[-20, -10, -5]} minVal={null} maxVal="" height={26} label="Negative auto-bounds" />);
    const negSvg = screen.getByRole('img', { name: 'Negative auto-bounds' });
    const negPoints = negSvg.querySelector('polyline').getAttribute('points').split(' ');
    expect(negPoints[0].endsWith(',23.00')).toBe(true);
    expect(negPoints[2].endsWith(',3.00')).toBe(true);

    rerenderSpark(<Sparkline values={[10, 20, 30]} minVal="" maxVal={null} height={36} label="Positive auto-bounds" />);
    const posSvg = screen.getByRole('img', { name: 'Positive auto-bounds' });
    const posPoints = posSvg.querySelector('polyline').getAttribute('points').split(' ');
    expect(posPoints[0].endsWith(',23.00')).toBe(true);
    expect(posPoints[2].endsWith(',3.00')).toBe(true);

    // Explicit minVal={0} and inverted bounds (minVal > maxVal) must remain safe
    rerenderSpark(<Sparkline values={[10, 20, 30]} minVal={50} maxVal={10} height={26} label="Inverted bounds" />);
    const invSvg = screen.getByRole('img', { name: 'Inverted bounds' });
    const invPoints = invSvg.querySelector('polyline').getAttribute('points').split(' ');
    expect(invPoints[0].endsWith(',23.00')).toBe(true);
    expect(invPoints[2].endsWith(',23.00')).toBe(true);

    // Null/empty entries in values should be filtered out rather than coerced to 0
    rerenderSpark(<Sparkline values={[null, '', '   ']} label="Null-only values" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // Empty/null label marks the SVG decorative rather than emitting an empty role="img" name
    rerenderSpark(<Sparkline values={[10, 20]} label="" />);
    const decorativeSvg = container.querySelector('svg');
    expect(decorativeSvg).toHaveAttribute('aria-hidden', 'true');
    expect(decorativeSvg).not.toHaveAttribute('role');
  });

  it('WorkflowSystemMap, CourseworkMarksPlanner, CoverageProgressCard, FilterToolbar, CapabilityDisclosure, WorkspaceActionStrip, WorkflowCards, and DirectContactPanel handle hardened edge cases', async () => {
    // WorkflowSystemMap handles null-only stages, missing tabLabel, and blocks javascript: actionHref
    const { unmount: unmountMap } = render(<WorkflowSystemMap stages={[null, undefined]} actionHref="javascript:alert(1)" />);
    expect(screen.getByRole('tablist', { name: 'System map stages' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    unmountMap();

    const { unmount: unmountCustomMap } = render(
      <WorkflowSystemMap stages={[{ id: 'only-title', title: 'Custom Stage' }]} />,
    );
    expect(screen.getByRole('tab', { name: 'Custom Stage' })).toBeInTheDocument();
    unmountCustomMap();

    // WorkflowCards safely ignores string/number/object icons without crashing or emitting unknown tags
    const { container: cardsContainer, unmount: unmountCards } = render(
      <WorkflowCards
        steps={[
          { title: 'String Icon', icon: 'layers' },
          { title: 'Object Icon', icon: { invalid: true } },
          { title: 'Number Icon', icon: 42 },
        ]}
      />,
    );
    expect(cardsContainer.querySelector('layers')).toBeNull();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    unmountCards();

    // CoverageProgressCard clamps completed to 0 when total is 0
    const { unmount: unmountCoverage } = render(<CoverageProgressCard completed={5} total={0} />);
    expect(screen.getByText((_, node) => node?.textContent === '0 of 0 tasks completed')).toBeInTheDocument();
    unmountCoverage();

    // CourseworkMarksPlanner ignores whitespace inputs, handles zero totalWeight, and resets when tasks change
    const { rerender, unmount: unmountPlanner } = render(
      <CourseworkMarksPlanner
        tasks={[
          { id: 't1', label: 'Task A', max: 100, weight: 50 },
          { id: 't2', label: 'Task B', max: 100, weight: 50 },
        ]}
        initialValues={['   ', '50']}
      />,
    );
    expect(screen.getByText('25.0 / 100')).toBeInTheDocument();

    rerender(
      <CourseworkMarksPlanner
        tasks={[{ id: 't3', label: 'Unweighted', max: 10, weight: 0 }]}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/positive task weights/i);
    unmountPlanner();

    // FilterToolbar normalizes numeric options, handles duplicate option values, and ignores invalid resultCount
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onFilterChange = vi.fn();
    const { rerender: rerenderFilter, unmount: unmountFilter } = render(
      <FilterToolbar filterOptions={[0, 1, '0']} resultCount="" onFilterChange={onFilterChange} />,
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
    rerenderFilter(<FilterToolbar filterOptions={[0, 1]} resultCount={Number.NaN} onFilterChange={onFilterChange} />);
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
    expect(onFilterChange).toHaveBeenCalledWith({ search: '', selectedFilter: '0' });
    errorSpy.mockRestore();
    unmountFilter();

    // CapabilityDisclosure & WorkspaceActionStrip block unsafe hrefs
    const { unmount: unmountSafe } = render(
      <>
        <CapabilityDisclosure defaultOpen items={[{ title: 'Unsafe', href: 'javascript:evil()', detail: 'Blocked' }]} />
        <WorkspaceActionStrip actionHref="javascript:evil()" actionLabel="Do action" />
      </>,
    );
    expect(screen.queryByRole('link', { name: 'Unsafe' })).toBeNull();
    expect(screen.queryByRole('link', { name: /do action/i })).toBeNull();
    unmountSafe();

    // DirectContactPanel resets copy status when email prop changes
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { rerender: rerenderContact } = render(<DirectContactPanel email="one@sankofa.co.za" whatsappNumber="" />);
    fireEvent.click(screen.getByRole('button', { name: /copy email address/i }));
    await waitFor(() => expect(screen.getByText('Copied one@sankofa.co.za')).toBeInTheDocument());
    rerenderContact(<DirectContactPanel email="two@sankofa.co.za" whatsappNumber="" />);
    expect(screen.queryByText('Copied one@sankofa.co.za')).toBeNull();
    vi.unstubAllGlobals();
  });
});
