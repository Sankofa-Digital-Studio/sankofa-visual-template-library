import { expect, it } from 'vitest';
import * as source from '../index';
import * as entry from '../../../packages/ui/index.js';
import { COMPONENT_REGISTRY, UI_EXPORT_NAMES } from '../docs/registry';

// Names supported before this reconciliation must survive registry edits.
const previousExports = [
  'ApplicationShell', 'Button', 'CapabilityDisclosure', 'Card', 'createOfflineOutbox',
  'DataTableShell', 'Drawer', 'ExportMenu', 'FeatureCard', 'FilterToolbar', 'GroupedTabNav',
  'InlineFeedback', 'OfflineSaveButton', 'OfflineSyncStatus', 'ProgressBar',
  'ResponsiveNavigation', 'Sparkline', 'StatusBadge', 'WorkflowCards',
  'WorkflowStepper', 'WorkflowSystemMap',
];

it('classifies every registry entry and keeps its integration imports within the supported API', () => {
  for (const item of COMPONENT_REGISTRY) {
    expect(Boolean(item.internalReason), item.id).toBe(item.publicExports.length === 0);
    const example = [item.exportCode, item.mainJsxCode].join('\n');
    if (item.internalReason) {
      expect(example, item.id).not.toContain('@sankofa/ui');
      continue;
    }
    expect(example, item.id).toContain('@sankofa/ui');
    for (const match of example.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@sankofa\/ui['"]/g)) {
      const names = match[1].split(',').map((name) => name.trim()).filter(Boolean);
      expect(UI_EXPORT_NAMES, item.id).toEqual(expect.arrayContaining(names));
    }
  }
});

it('preserves existing exports and exposes exactly the supported names from the source library', () => {
  expect(UI_EXPORT_NAMES).toEqual(expect.arrayContaining(previousExports));
  expect(Object.keys(entry).sort()).toEqual(UI_EXPORT_NAMES);
  for (const name of UI_EXPORT_NAMES) {
    expect(typeof source[name], name).toBe('function');
    expect(entry[name], name).toBe(source[name]);
  }
});

it('requires an explicit decision for every additional source export', () => {
  const sourceOnly = [
    // Branded storefront fixtures and the showcase route surface.
    'RecipesPage', 'ReviewsPage', 'PublicRouteSurface',
    // Policy generation internals behind the public React kit.
    'DEFAULT_POLICY_LINKS', 'LEGAL_PROJECT_TYPES', 'createPolicySections', 'resolvePolicyLinks',
  ];
  expect(Object.keys(source).sort()).toEqual([...UI_EXPORT_NAMES, ...sourceOnly].sort());
});
