import React from 'react';
import bowls from '../pages/_data/bowls.json';
import MoveButton from './MoveButton';
import Image from './Image';
import { ellipsize } from './utils';

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
    const { num, href } = this.props;
    const bowl = numToBowl[num];
    const [ellipsized, cut] = ellipsize(bowl.description, 200);

    return (
      <div className="bowl-overlay" onClick={this.close}>
        <div className="overlay-size" onClick={this.stop}>
          <div className="bowl-header">
            <div className="move-buttons">
              <MoveButton dir="left" n={this.left()} goto={this.goto} />
              <div className="move-vertical-buttons">
                <MoveButton dir="up" n={this.up()} goto={this.goto} />
                <MoveButton dir="down" n={this.down()} goto={this.goto} />
              </div>
              <MoveButton dir="right" n={this.right()} goto={this.goto} />
            </div>
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
                <a href={href}>
                  <Image
                    dataPath={`bowls.${num}.0.overlay`}
                    alt=""
                    className="overlay-image" />
                </a>
              </div>
              <div className={`bowl-info ${cut ? 'cut' : ''}`}>
                <h2>
                  <a href={href}>Bowl #{num}</a>
                  {bowl.sense.length > 0 && (
                    <small> — {bowl.sense.join(', ')}</small>
                  )}
                </h2>
                {ellipsized && (
                  <p className="description">
                    {ellipsized}{cut && (<span className="continue"> <a href={href}>continue reading&hellip;</a></span>)}
                  </p>
                )}
                {(bowl.signed || bowl.species || bowl.finish) && (
                  <dl>
                    {bowl.signed && (<><dt>Signed</dt><dd>{bowl.signed}</dd></>)}
                    {bowl.species && (<><dt>Species</dt><dd>{bowl.species}</dd></>)}
                    {bowl.finish && (<><dt>Finish</dt><dd>{bowl.finish}</dd></>)}
                  </dl>
                )}
                <p>
                  <a className="full-details" href={href}>Full details »</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BowlOverlay;
