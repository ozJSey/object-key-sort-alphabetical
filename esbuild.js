const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['out/extension.js'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  minify: false,
  sourcemap: true,
  loader: {
    '.js': 'js',
    '.ts': 'ts'
  }
}).catch(() => process.exit(1));