import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { UI_EXPORT_NAMES } from '../src/library/docs/registry.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const temp = await mkdtemp(join(tmpdir(), 'sankofa-ui-'));
try {
  execFileSync(process.execPath, [
    process.env.npm_execpath, 'pack', '--workspace', '@sankofa/ui',
    '--pack-destination', temp,
  ], { cwd: root, stdio: 'inherit' });
  const archives = (await readdir(temp)).filter((name) => name.endsWith('.tgz'));
  if (archives.length !== 1) throw new Error('Expected exactly one package tarball.');
  const archive = join(temp, archives[0]);
  const files = execFileSync('tar', ['-tf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/).sort();
  const expected = ['package/dist/index.js', 'package/dist/styles.css', 'package/package.json'];
  if (JSON.stringify(files) !== JSON.stringify(expected)) {
    throw new Error('Unexpected tarball contents: ' + files.join(', '));
  }

  // Unpack into an isolated consumer with only the declared libraries linked locally.
  const modules = join(temp, 'node_modules');
  const installed = join(modules, '@sankofa', 'ui');
  await mkdir(installed, { recursive: true });
  execFileSync('tar', ['-xf', archive, '--strip-components=1', '-C', installed]);
  for (const name of ['react', 'react-dom', 'lucide-react']) {
    await symlink(dirname(require.resolve(name + '/package.json')), join(modules, name), 'junction');
  }
  await writeFile(join(temp, 'verify.mjs'), `
    import assert from 'node:assert/strict';
    import { createElement } from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import * as ui from '@sankofa/ui';
    assert.deepEqual(Object.keys(ui).sort(), ${JSON.stringify(UI_EXPORT_NAMES)});
    for (const name of Object.keys(ui)) assert.equal(typeof ui[name], 'function', name);
    assert.match(renderToStaticMarkup(createElement(ui.Button, null, 'Package works')), /Package works/);
    assert.throws(() => import.meta.resolve('@sankofa/ui/dist/index.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  `);
  execFileSync(process.execPath, [join(temp, 'verify.mjs')], { stdio: 'inherit' });

  await copyFile(join(root, 'examples/ui-consumer/App.jsx'), join(temp, 'App.jsx'));
  await writeFile(join(temp, 'index.html'), '<div id="root"></div><script type="module" src="/main.jsx"></script>');
  await writeFile(join(temp, 'main.jsx'), `
    import { createRoot } from 'react-dom/client';
    import App from './App.jsx';
    createRoot(document.getElementById('root')).render(<App />);
  `);
  await build({ root: temp, configFile: false, esbuild: { jsx: 'automatic' } });
  console.log(`Verified ${UI_EXPORT_NAMES.length} ESM exports and built the Vite consumer using the packed JS and CSS.`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
