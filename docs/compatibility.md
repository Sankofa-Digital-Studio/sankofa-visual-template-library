# Compatibility matrix

| Surface | Baseline | Status |
| --- | --- | --- |
| React and React DOM | 19.x | reference consumer. Package peers accept 18+ |
| Vite | 7.x | reference consumer |
| Node | 20.19+ or 22.12+ | Vite build toolchain |
| Tailwind | 3.x | package ships compiled CSS |
| Next.js and other React bundlers | ESM and global CSS support | integration guidance in the installation guide |
| Angular, Vue and Svelte | React mount or native adaptation | outside the verified baseline |
| Supabase region | `sa-east-1` default | configurable |
| Vercel | static-first Free-compatible | supported |

Package versions are pinned by generated projects. Changes require a changelog entry and a compatibility review.

See the [installation guide](public/installation.md) for local tarball use and runtime dependencies.
