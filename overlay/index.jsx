import React from 'react';
import ReactDOM from 'react-dom/client';
import bowls from '../data/bowls.json';

const numToBowl = bowls.reduce((a, b) => {
  a[b.number] = b;
  return a;
}, {});


class BowlOverlay extends React.Component {
  esc = () => window.location.hash = '';
  stop = e => e.stopPropagation();
  render() {
    const bowl = numToBowl[this.props.num];
    return (
      <div className="bowl-overlay" onClick={this.esc}>
        <div className="overlay-content" onClick={this.stop}>
          <h2>Bowl #{this.props.num}</h2>
          <div className="bowl-detail flow left">
            <div className="bowl-images">
              <img height="200" width="300" alt="" />
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
