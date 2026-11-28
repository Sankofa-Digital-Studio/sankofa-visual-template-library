# Sankofa Visual Template Library

An enterprise-grade, standalone React 19 + Tailwind CSS component design system and visual template showcase built for the Sankofa platform ecosystem.

## 🚀 Overview

The **Sankofa Visual Template Library** provides a growing registry of production-grade, white-label, highly customizable UI components, layout primitives, and hooks. The showcase count is derived from the component registry rather than hard-coded. Each component is paired with:
1. **Interactive Live Previews** (live prop tweaking, state triggers, modal openers, toast dispatches).
2. **Deep Architectural Explanations** (WAI-ARIA accessibility, layout shift mitigation, mobile bandwidth performance).
3. **Real-World Use Cases** (E-commerce storefronts, SaaS dashboards, mobile PWAs, and editorial branding).
4. **Customization Options & Props API** (prop names, types, default values, and description tables).
5. **Integration examples** with component imports and React usage.

---

## Component inventory

<!-- BEGIN GENERATED INVENTORY -->
The registry has **59 entries**. **57** have supported imports from `@sankofa/ui`.

| Registry entry | Category | Package API or internal status |
| --- | --- | --- |
| E-Commerce Product Card | Commerce | `ProductCard` |
| Featured Gifts & Hamper Showcase | Commerce | `FeaturedGifts` |
| Approved Image | Commerce & Content | `ApprovedImage` |
| Commerce Route Hero | Commerce & Content | `CommerceRouteHero` |
| Product Detail | Commerce & Content | `ProductDetail` |
| Principles Matrix | Compliance & Legal | `PrinciplesMatrix` |
| South African Legal Policy Kit | Compliance & Legal | `LegalPolicyPage`, `LegalFooterLinks`, `PolicyDocumentIndex`, `ComplianceDisclaimer`, `PolicyCustomizer` |
| Featured Reviews Carousel/Grid | Data & Proof | `FeaturedReviews` |
| Impact & KPI Tracker | Data & Proof | `ImpactTracker` |
| Editorial Founder Story | Editorial & Content | `FounderStory` |
| Education Hub Section | Editorial & Content | `EducationHubSection` |
| Featured Recipes Grid | Editorial & Content | `FeaturedRecipes` |
| Action Feedback | Feedback & Overlays | `ActionFeedback` |
| Inline Feedback | Feedback & Overlays | `InlineFeedback` |
| Toast Notification System | Feedback & Overlays | `Toast` |
| Direct Contact Panel | Forms & Overlays | `DirectContactPanel` |
| Button | Foundations | `Button` |
| Capability Grid | Foundations | `CapabilityGrid` |
| Card | Foundations | `Card` |
| Feature Card | Foundations | `FeatureCard` |
| Progress Bar | Foundations | `ProgressBar` |
| useScrollLock Custom Hook | Hooks | `useScrollLock` |
| Fluid Layout Container | Layout | `Container` |
| Semantic Section | Layout | `Section` |
| Capability Disclosure | Learning & Interaction | `CapabilityDisclosure` |
| Coursework Marks Planner | Learning & Interaction | `CourseworkMarksPlanner` |
| Coverage Progress Card | Learning & Interaction | `CoverageProgressCard` |
| Diagnostic Assessment Card | Learning & Interaction | `DiagnosticAssessmentCard` |
| Expandable Section | Learning & Interaction | `ExpandableSection` |
| Learner Progress Ribbon | Learning & Interaction | `LearnerProgressRibbon` |
| Repair Studio Card | Learning & Interaction | `RepairStudioCard` |
| Single Open Accordion | Learning & Interaction | `SingleOpenAccordion` |
| Breadcrumbs Navigation | Navigation | `Breadcrumbs` |
| Application Shell | Navigation & Shell | `ApplicationShell` |
| Command Palette | Navigation & Shell | `CommandPalette` |
| Delivery Process Flow | Navigation & Shell | `DeliveryProcessFlow` |
| Grouped Tab Nav | Navigation & Shell | `GroupedTabNav` |
| Responsive Navigation | Navigation & Shell | `ResponsiveNavigation` |
| Site Footer | Navigation & Shell | `SiteFooter` |
| Workflow Stepper | Navigation & Shell | `WorkflowStepper` |
| Workflow System Map | Navigation & Shell | `WorkflowSystemMap` |
| Data Table Shell | Operations & Feedback | `DataTableShell` |
| Export Menu | Operations & Feedback | `ExportMenu` |
| Filter Toolbar | Operations & Feedback | `FilterToolbar` |
| Interactive Stat Card | Operations & Feedback | `InteractiveStatCard` |
| Offline Save Button | Operations & Feedback | `OfflineSaveButton` |
| Offline Sync Status | Operations & Feedback | `OfflineSyncStatus` |
| Operational Metric Strip | Operations & Feedback | `OperationalMetricStrip` |
| Sparkline | Operations & Feedback | `Sparkline` |
| Status Badge | Operations & Feedback | `StatusBadge` |
| Workflow Cards | Operations & Feedback | `WorkflowCards` |
| Workspace Action Strip | Operations & Feedback | `WorkspaceActionStrip` |
| Accessible Dialog Modal | Overlays & Modals | `Modal` |
| Drawer | Overlays & Modals | `Drawer` |
| Image Lightbox Modal | Overlays & Modals | `ImageModal` |
| Notification Toast | Overlays & Modals | `Toast` |
| Video Player Modal | Overlays & Modals | `VideoModal` |
| Customer Reviews Full Page | Pages | Internal template with embedded storefront ratings and reviews. |
| Recipes & Lifestyle Full Page | Pages | Internal template with embedded storefront recipe data. |

Additional package exports include `ProductCatalogue`, `buildRepairSummary`, `createOfflineOutbox`, `getDiagnosticActionLabel`, `validateLegalConfig`.

<!-- END GENERATED INVENTORY -->

The [integration guide](docs/public/installation.md) covers workspace and local tarball use. Run `npm run ui:sync` after editing registry metadata.

---

## 🛠️ Quick Start

```bash
# Install dependencies from the repository root
npm ci

# Start the interactive development server
npm run dev

# Build for production
npm run build
```

---

## Reuse components

Use the package imports shown in the inventory and follow the [integration example](examples/ui-consumer/App.jsx). The showcase provides component usage and integration snippets. Internal templates are available through the repository source for authorized maintainers.

## Mobile and offline

Open **Documentation → Mobile navigation and offline use** in the showcase for the implementation notes, React and Angular integration guidance, and a component-by-component reference.

Run `npm run build` and `npm run preview` to exercise offline saving. The worker is registered only in production builds. For verification, run `npm test`, then install Chromium with `npx playwright-core install chromium` and run `npm run test:browser` against the built output. Set `CHROMIUM_PATH` to use an existing Chromium binary.
