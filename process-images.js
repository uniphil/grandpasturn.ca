const Image = require('@11ty/eleventy-img');
const { writeFile } = require('node:fs');
const { basename, extname, sep, join } = require('node:path');
const { promisify } = require('node:util');

const images = require('./data/images.json');

function filenameFormat(id, src, width, format) {
  const [fname, ...bits] = src.split(sep).reverse();
  const [_, ...dirs] = bits.reverse();
  const name = [...dirs, basename(fname, extname(fname))].join('_');
  return `${name}-${width}-${id}.${format}`;
}

async function doStuff(source, widths, o) {
  const formats = ['avif', 'jpeg'];

  for (let [name, width] of Object.entries(widths)) {
    const path = `originals/${source}`;
    const imageOptions = {
      outputDir: 'static/images',
      urlPath: 'images',
      formats,
      filenameFormat,
      widths: [width, width * 2],  // *2 for retina versions
      sharpAvifOptions: { quality: 75 },
      sharpJpegOptions: { quality: 88 },
    };
    let meta;
    try {
      meta = await Image(path, imageOptions);
      console.log(path);
    } catch (e) {
      console.error(`Error while processing ${path}`);
      throw e;
    }

    const simplify = ({ height, width, url }) => ({ height, width, file: url });
    const sources = formats.map(type => ({ type, files: meta[type].map(simplify) }));
    const canonical = simplify(meta.jpeg.find(m => m.width === width));

    o[name] = { canonical, sources };
  }
}

async function renderImages(e) {
  const imageTasks = [];
  const out = {};

  for (let [id, config] of Object.entries(images)) {
    const o = out[id] = {};
    if ('source' in config) {
      imageTasks.push(doStuff(config.source, config.widths, o));
    } else {
      for (let [name, sources] of Object.entries(config.sources)) {
        const p = o[name] = [];
        sources.forEach((source, i) => {
          const q = {};
          p.push(q);
          imageTasks.push(doStuff(source, config.widths, q));
        });
      }
    }
  }
  await Promise.all(imageTasks);

  const data = JSON.stringify(out, null, 2);
  await promisify(writeFile)(join('pages', '_data', 'images.json'), data, 'utf-8');
}

renderImages();
