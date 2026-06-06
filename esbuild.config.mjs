import { build } from 'esbuild'
import {sassPlugin} from 'esbuild-sass-plugin'
import fs from 'fs';
import copydir from 'copy-dir';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const isWatch = process.argv.includes('--watch');

build({
  entryPoints: {
    main: './src/main/js/main.js',
  },
  entryNames: 'index',
  outdir: './docs',
  assetNames: '.[dir]/',
  chunkNames: 'index.js',
  loader: {
    '.js': 'jsx',
    '.ts': 'ts',
    '.jpg': 'dataurl',
    '.png': 'file',
    '.cur': 'file',
    '.html': 'file',
  },
  bundle: true,
  minify: true,
  sourcemap: true,
  metafile: true,
  publicPath: './',
  watch: isWatch,
})

build({
  entryPoints: {
    main: './src/main/html/main.html',
  },
  outdir: './docs',
  assetNames: './index',
  chunkNames: 'index.html',
  loader: { '.html': 'file' },
  watch: isWatch,
});

build({
  entryPoints: {
    main: './src/main/css/main.scss',
  },
  entryNames: 'index',
  outdir: './docs',
  assetNames: 'index',
  chunkNames: 'index.css',
  bundle: true,
  watch: isWatch,
  plugins: [
    sassPlugin({
        async transform(source) {
            const { css } = await postcss([autoprefixer]).process(
                source
            );
            return css;
        },
    }),
    ],
  loader: { '.css': 'file' },
});

// if ./docs is not exist, mkdir
if (!fs.existsSync('./docs')) {
  fs.mkdirSync('./docs');
}

copydir.sync('./assets', './docs/assets', {
  utimes: true, // keep add time and modify time
  mode: true, // keep file mode
  cover: true, // cover file when exists, default is true
});