import React from 'react';
import ReactDOM from 'react-dom/client';
import bowls from '../pages/_data/bowls.json';
import images from '../pages/_data/images.json';
const { walk, srcset, u } = require('../image-data-util');

const numToBowl = bowls.reduce((a, b) => {
  a[b.number] = b;
  return a;
}, {});


const Image = ({ dataPath, alt, className }) => {
  let image;
  try {
    image = walk(images, dataPath);
  } catch (e) {
    console.warn(`Failed to walk image dataPath "${dataPath}": ${e}`);
    return <img src="error" alt="" />;
  }
  const sources = image.sources.map(s =>
    <source type={`image/${s.type}`} srcset={srcset(s.files)} />);
  return (
    <picture>
      {sources}
      <img
        class={className}
        src={u(image.canonical.file)}
        height={image.canonical.height}
        width={image.canonical.width}
        alt={alt} />
    </picture>
  );
}


class BowlOverlay extends React.Component {
  esc = () => window.location.hash = '';
  stop = e => e.stopPropagation();
  leftButton() {
    const num = parseInt(this.props.num, 10);
    if (num % 9 === 1) return;
    const target = num - 1;
    return <a href={`#${target}`} class="move lr" title={`Bowl #${target}`}>« {target}</a>;
  }
  rightButton() {
    const num = parseInt(this.props.num, 10);
    if (num % 9 === 0) return;
    const target = num + 1;
    return <a href={`#${target}`} class="move lr" title={`Bowl #${target}`}>{target} »</a>;
  }
  render() {
    const { num } = this.props;
    const bowl = numToBowl[num];

    return (
      <div className="bowl-overlay" onClick={this.esc}>
        <div class="overlay-size" onClick={this.stop}>
          <div className="bowl-header">
            <div>
              {this.leftButton()}
              {this.rightButton()}
            </div>
            <h2>#{num}</h2>
            <button
              class="reset close"
              title="close preview"
              onClick={this.esc}>
              &times;
            </button>
          </div>
          <div className="overlay-content">
            <div className="bowl-detail flow left">
              <div className="bowl-images">
                <Image
                  dataPath={`bowls.${num}.0.overlay`}
                  alt=""
                  className="overlay-image" />
              </div>
              <div className="bowl-info flow">
                <p>{bowl.description}</p>
                <p>Completed {bowl.date}</p>
                <ul className="actual">
                  <li>{bowl.source}</li>
                  <li>{bowl.feature}</li>
                </ul>
                <a className="button" href={this.props.href}>
                  Read more&hellip;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Array.from(document.querySelectorAll('[data-overlay-bowl]')).forEach(el => {
  el.setAttribute('data-permalink', el.href);
  el.href = `#${el.getAttribute('data-overlay-bowl')}`
});


const root = ReactDOM.createRoot(document.getElementById('hi-app'));
function nav(u) {
  const num = u.hash.split('#')[1];
  const el = document.querySelector(`[data-overlay-bowl='${num}']`);
  if (num === undefined || el === undefined) {
    root.render(<></>);
  } else {
    const href = el.getAttribute('data-permalink');
    root.render(<BowlOverlay num={num} href={href} />);
  }
}
nav(window.location);
addEventListener('hashchange', e => nav(new URL(e.newURL)));
addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.keyCode === 13) {
    window.location.hash = '';
  }
});
