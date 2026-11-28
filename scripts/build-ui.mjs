import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { build } from 'vite';
import tailwindConfig from '../tailwind.config.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const ui = new URL('../packages/ui/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', ui), 'utf8'));
const externals = [...Object.keys(manifest.peerDependencies), ...Object.keys(manifest.dependencies)];

await build({
  root,
  configFile: false,
  publicDir: false,
  esbuild: { jsx: 'automatic', loader: 'jsx', include: /src\/library\/.*\.jsx?$/, exclude: [] },
  build: {
    outDir: fileURLToPath(new URL('dist/', ui)),
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('index.js', ui)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: (id) => externals.some((name) => id === name || id.startsWith(name + '/')),
    },
  },
});

const sharedStyles = await readFile(new URL('../src/library/styles.css', import.meta.url), 'utf8');
const styles = await postcss([
  tailwindcss({
    ...tailwindConfig,
    corePlugins: { preflight: false },
    content: [root.replaceAll('\\', '/') + 'src/library/**/*.{js,jsx}', '!' + root.replaceAll('\\', '/') + 'src/library/{docs,__tests__}/**/*'],
  }),
  autoprefixer,
]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' + sharedStyles, { from: undefined });
await writeFile(new URL('dist/styles.css', ui), styles.css);
