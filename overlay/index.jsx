import React from 'react';
import ReactDOM from 'react-dom/client';

class BowlOverlay extends React.Component {
  constructor(props) {
    super();
    this.state = {};
    console.log('heyo', props.num)
  }
  esc = () => window.location.hash = '';
  stop = e => e.stopPropagation();
  render() {
    return (
      <div className="bowl-overlay" onClick={this.esc}>
        <div className="overlay-content" onClick={this.stop}>
          <h2>Bowl #{this.props.num}</h2>
          <img height="200" width="300" alt="" />
          <a class="button" href={this.props.href}>
            Read more&hellip;
          </a>
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
  console.log({num, el});
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
