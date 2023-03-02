import React from 'react';
import ReactDOM from 'react-dom/client';
import bowls from '../pages/_data/bowls.json';
import MoveButton from './MoveButton';
import Image from './Image';

const numToBowl = bowls.reduce((a, b) => {
  a[b.number] = b;
  return a;
}, {});


class BowlOverlay extends React.Component {
  componentDidMount() {
    addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.keyCode === 13) {
      this.close();
    } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
      this.goto(this.left());
    } else if (e.key === 'ArrowUp' || e.keyCode == 38) {
      this.goto(this.up());
    } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
      this.goto(this.right());
    } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
      this.goto(this.down());
    }
  };

  close = () =>
    window.location.hash = '';

  goto = n => {
    if (n) window.location.hash = n;
  }

  left = () => {
    const v = parseInt(this.props.num, 10);
    if (v <= 1) {
      return;
    } else if (v === 80) {
      return 55;
    } else {
      return v - 1;
    }
  };

  up = () => {
    const v = parseInt(this.props.num, 10);
    if (v <= 9) {
      return;
    } else if (v <= 55) {
      return v - 9;
    } else {
      return v - 27;
    }
  };

  right = () => {
    const v = parseInt(this.props.num, 10);
    if (v >= 81) {
      return;
    } else if (v === 55) {
      return 80;
    } else {
      return v + 1;
    }
  };

  down = () => {
    const v = parseInt(this.props.num, 10);
    if (v <= 46) {
      return v + 9;
    } else if (v <= 52) {
      return;
    } else if (v <= 54) {
      return v + 27;
    } else {
      return;
    }
  };

  stop = e =>
    e.stopPropagation();

  render() {
    const { num } = this.props;
    const bowl = numToBowl[num];

    return (
      <div className="bowl-overlay" onClick={this.close}>
        <div className="overlay-size" onClick={this.stop}>
          <div className="bowl-header">
            <div className="move-buttons flow left">
              <MoveButton dir="left" n={this.left()} goto={this.goto} />
              <div className="move-vertical-buttons">
                <MoveButton dir="up" n={this.up()} goto={this.goto} />
                <MoveButton dir="down" n={this.down()} goto={this.goto} />
              </div>
              <MoveButton dir="right" n={this.right()} goto={this.goto} />
            </div>
            <h2>#{num}</h2>
            <button
              className="reset pointer close"
              title="close preview"
              onClick={this.close}>
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
                <p>{bowl.date}</p>
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
