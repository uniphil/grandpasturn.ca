module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static');
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  return { dir: { input: 'pages' } };
};
