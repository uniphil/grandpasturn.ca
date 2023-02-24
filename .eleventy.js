const esbuild = require('esbuild');

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addWatchTarget('./overlay/');
  eleventyConfig.on('afterBuild', () => esbuild.build({
    entryPoints: ['overlay/index.jsx'],
    outfile: '_site/static/overlay.js',
    bundle: true,
    target: 'es6',
    minify: process.env.ELEVENTY_ENV === 'production',
    sourcemap: true
  }));
  return { dir: { input: 'pages' } };
};
