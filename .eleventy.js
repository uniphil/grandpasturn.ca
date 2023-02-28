const Image = require('@11ty/eleventy-img');
const esbuild = require('esbuild');

async function imageShortcode(src, alt, widths, sizes, className='') {
  const w = widths.concat(widths.map(w => w * 2));
  console.log({ w });
  const meta = await Image(src, {
    outputDir: '_site/static/images',
    urlPath: '/static/images',
    widths: w,
    formats: ['avif', 'jpeg', 'webp'],
    sharpAvifOptions: { quality: 75 },
    sharpJpegOptions: { quality: 92 },
    sharpWebpOptions: { quality: 92 },
  });
  return Image.generateHTML(meta, { alt, sizes, 'class': className });
}

module.exports = eleventyConfig => {
  eleventyConfig.addAsyncShortcode('image', imageShortcode);
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  // eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
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
