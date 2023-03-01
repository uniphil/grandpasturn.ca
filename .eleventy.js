const Image = require('@11ty/eleventy-img');
const esbuild = require('esbuild');
const fsWalk = require('@nodelib/fs.walk');
const { readFile, writeFile } = require('node:fs');
const { join } = require('node:path');
const { promisify } = require('node:util');

let _read = promisify(readFile);
async function imageShortcode(path, alt, className='') {
  const info = JSON.parse(await _read('./data/images.json', 'utf-8'))[path];
  const u = path => `/static/${path}`;
  const srcset = files => files.map(f => `${u(f.file)} ${f.width}w`).join(', ');
  const sources = info.sources.map(s => `
      <source type="image/${s.type}" srcset="${srcset(s.files)}" />`).join('');
  return `
    <picture>
      ${sources}
      <img
        class="${className}"
        src="${u(info.canonical.file)}"
        height="${info.canonical.height}"
        width="${info.canonical.width}"
        alt="${alt}" />
    </picture>
  `;
}

async function renderImages(e) {
  const cssWidths = [672];
  const formats = ['avif', 'jpeg', 'webp'];

  const widths = cssWidths.concat(cssWidths.map(w => w * 2));
  const biggest = Math.min.apply(this, widths);
  const entries = await promisify(fsWalk.walk)('images');
  const files = entries.filter(({ dirent }) => dirent.isFile());
  const imData = await Promise.all(files.map(async ({ path }) => {
    const meta = await Image(path, {
      outputDir: '_site/static/images',
      urlPath: 'images',
      widths,
      formats,
      sharpAvifOptions: { quality: 75 },
      sharpJpegOptions: { quality: 92 },
      sharpWebpOptions: { quality: 92 },
    });
    const simplify = ({ height, width, url }) => ({ height, width, file: url });
    const sources = formats.map(type => ({ type, files: meta[type].map(simplify) }));
    const canonical = simplify(meta.jpeg.find(m => m.width === biggest));
    return { path, picture: { canonical, sources } };
  }));
  const mapped = imData.reduce((acc, { path, picture }) => ({ ...acc, [path]: picture }), {});
  await promisify(writeFile)(join('data', 'images.json'), JSON.stringify(mapped), 'utf-8');
}

module.exports = eleventyConfig => {
  eleventyConfig.addAsyncShortcode('image', imageShortcode);
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  // eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addWatchTarget('./images/');
  eleventyConfig.on('beforeBuild', renderImages);
  eleventyConfig.addWatchTarget('./overlay/');
  eleventyConfig.on('afterBuild', () => esbuild.build({
    entryPoints: ['overlay/index.jsx'],
    outfile: '_site/static/overlay.js',
    bundle: true,
    target: 'es6',
    minify: process.env.NODE_ENV === 'production',
    sourcemap: true
  }));
  return { dir: { input: 'pages' } };
};
