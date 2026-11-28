# Install and use Sankofa UI

The repository README lists the supported named exports from `@sankofa/ui` and identifies internal templates. Sankofa UI is proprietary. Use requires authorization from Sankofa Digital Studio.

The branded recipe and review pages, showcase route surface, and policy-generation internals remain repository features. The package supports the policy UI and configuration validator, as well as the outbox, catalogue and learning helpers listed in its generated entry point. Source modules outside the registry and package entry carry no downstream compatibility guarantee.

## Workspace setup

From the repository root, run `npm ci`. The workspace package builds during setup. Run `npm run ui:build` after changing component source to refresh the workspace package. Use `npm run ui:sync` after changing registry metadata.

## Use a local tarball in another app

- In the library checkout, run `npm pack --workspace @sankofa/ui`.
- In your React app, run `npm install /path/to/sankofa-ui-0.1.0.tgz` using the path printed by npm.
- Import named components from `@sankofa/ui` and import `@sankofa/ui/styles.css` once in your client entry.
- Use `examples/ui-consumer/App.jsx` as a working example with a metric strip, progress indicator, and a callback.

## Framework and dependency support

The reference consumer uses React 19, React DOM 19, and Vite 7. The package retains the React 18+ peer range and declares React DOM 18+ as a peer. Keep React and React DOM on the same major version. The package is ESM and installs Lucide React as a runtime dependency.

The bundled stylesheet includes Tailwind 3 utilities and the Sankofa tokens with Tailwind Preflight disabled. Your app can use it without Tailwind. The stylesheet includes global utility selectors, so review CSS import order if your app defines utilities with the same names.

Other React bundlers need to support ESM and CSS imports. In a framework with React Server Components, import interactive UI from a client component and load the stylesheet where your framework permits global CSS. Angular, Vue, and Svelte consumers need a React mount or a native adaptation. Those integrations are outside the verified baseline.

Offline components depend on host-managed persistence and browser IndexedDB for the outbox. The host app supplies routing, product data, authentication, and any service worker. React DOM portals and offline browser APIs need a browser when exercised.

## Verify a change

Run `npm run ui:check`, `npm test`, and `npm run ui:verify` in the library checkout. The package check packs a local tarball, verifies all named imports from it and builds the example consumer.
