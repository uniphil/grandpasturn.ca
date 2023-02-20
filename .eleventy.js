module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static', { expand: true });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  return { dir: { input: 'pages' } };
};
