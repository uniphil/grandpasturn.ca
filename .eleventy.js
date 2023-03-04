const Image = require('@11ty/eleventy-img');
const esbuild = require('esbuild');
const fsWalk = require('@nodelib/fs.walk');
const { readFile, writeFile } = require('node:fs');
const { promisify } = require('node:util');

const { walk, srcset, u } = require('./image-data-util');

let info, _read = promisify(readFile), _write = promisify(writeFile);
async function loadImageInfo() {
  info = JSON.parse(await _read('./pages/_data/images.json', 'utf-8'));
}

function imageShortcode(dataPath, alt, className='', pictureClassName='') {
  let image;
  try {
    image = walk(info, dataPath);
  } catch (e) {
    console.warn(`Failed to walk image dataPath "${dataPath}": ${e}`);
    return '<img src="error" alt="" />';
  }
  const sources = image.sources.map(s => `
      <source type="image/${s.type}" srcset="${srcset(s.files)}" />`).join('');
  return `
    <picture class="${pictureClassName}">
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

function imagePathShortcode(dataPath, alt, className='', pictureClassName='') {
  return u(walk(info, dataPath).canonical.file);
}

async function joinBowlOrigins(e) {
  const [bowls, origins] = await Promise.all(['bowls', 'origins']
    .map(n => _read(`./data/${n}.json`, 'utf-8').then(JSON.parse)));
  bowls
    .filter(b => b.origin in origins)
    .forEach(b => b.origin = origins[b.origin].origin);
  const data = JSON.stringify(bowls, null, 2);
  await _write('./pages/_data/bowls.json', data, 'utf-8');
}

module.exports = eleventyConfig => {
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('image_path', imagePathShortcode);
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.on('eleventy.before', loadImageInfo);
  eleventyConfig.on('eleventy.before', joinBowlOrigins);
  eleventyConfig.addWatchTarget('./overlay/');
  eleventyConfig.addWatchTarget('./data/');
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
