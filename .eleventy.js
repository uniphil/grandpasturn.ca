const Image = require('@11ty/eleventy-img');
const esbuild = require('esbuild');
const fsWalk = require('@nodelib/fs.walk');
const { readFile, writeFile } = require('node:fs');
const { join } = require('node:path');
const { promisify } = require('node:util');

const { walk, srcset, u } = require('./image-data-util');

let info,  _read = promisify(readFile);
async function loadImageInfo() {
  info = JSON.parse(await _read('./pages/_data/images.json', 'utf-8'));
}

function imageShortcode(dataPath, alt, className='') {
  let image = walk(info, dataPath);
  const sources = image.sources.map(s => `
      <source type="image/${s.type}" srcset="${srcset(s.files)}" />`).join('');
  return `
    <picture>
      ${sources}
      <img
        class="${className}"
        src="${u(image.canonical.file)}"
        height="${image.canonical.height}"
        width="${image.canonical.width}"
        alt="${alt}" />
    </picture>
  `;
}

module.exports = eleventyConfig => {
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.on('beforeBuild', loadImageInfo);
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
