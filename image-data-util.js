
function walk(info, dataPath) {
  let image = info;
  for (let part of dataPath.split('.')) {
    image = image[part];
  }
  return image;
}

const u = path => `/static/${path}`;

const srcset = files => files.map(f => `${u(f.file)} ${f.width}w`).join(', ');

module.exports = { walk, u, srcset };
