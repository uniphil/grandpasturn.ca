import React from 'react';
import ReactDOM from 'react-dom/client';

class Overlay extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return <div>test test... bowl #{this.props.bowl}</div>;
  }
}


Array.from(document.querySelectorAll('[data-overlay-bowl]')).forEach(el => {
  el.setAttribute('data-permalink', el.href);
  el.href = `#${el.getAttribute('data-overlay-bowl')}`
});

const hashnum = u => u.hash.split('#')[1]
const root = ReactDOM.createRoot(document.getElementById('hi-app'));
root.render(<Overlay bowl={hashnum(window.location)} />);
addEventListener('hashchange', e =>
  root.render(<Overlay bowl={hashnum(new URL(e.newURL))} />));
