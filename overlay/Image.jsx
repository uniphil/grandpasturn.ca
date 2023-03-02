import React from 'react';
import images from '../pages/_data/images.json';
const { walk, srcset, u } = require('../image-data-util');

const Image = ({ dataPath, alt, className }) => {
  let image;
  try {
    image = walk(images, dataPath);
  } catch (e) {
    console.warn(`Failed to walk image dataPath "${dataPath}": ${e}`);
    return <img src="error" alt="" />;
  }
  const sources = image.sources.map((s, i) =>
    <source key={i} type={`image/${s.type}`} srcSet={srcset(s.files)} />);
  return (
    <picture>
      {sources}
      <img
        className={className}
        src={u(image.canonical.file)}
        height={image.canonical.height}
        width={image.canonical.width}
        alt={alt} />
    </picture>
  );
}

export default Image;
