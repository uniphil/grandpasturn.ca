import React from 'react';
import ReactDOM from 'react-dom/client';
import BowlOverlay from './BowlOverlay';

Array.from(document.querySelectorAll('[data-overlay-bowl]')).forEach(el => {
  el.setAttribute('data-permalink', el.href);
  el.href = `#${el.getAttribute('data-overlay-bowl')}`
});

let _gct = 100,
    _gcq = [],
    _count = ({ path, n }) => goatcounter.count({ path, title: n ? `Bowl ${n}` : '', event: true });
(function _gcPoll() {
  if (window.goatcounter && window.goatcounter.count) { _gcq.forEach(_count); _gcq = null; }
  else { setTimeout(_gcPoll, _gct); _gct *= 2; }
})();
function overlayEvent(path, n) {
  Array.isArray(_gcq) ? _gcq.push({ path, n }) : _count({ path, n });
}

const root = ReactDOM.createRoot(document.getElementById('overlay-app'));
let _overlayState = null;
function nav(u) {
  const num = u.hash.split('#')[1];
  const el = document.querySelector(`[data-overlay-bowl='${num}']`);
  if (num === undefined || el === undefined) {
    root.render(<></>);
    if (_overlayState !== null) overlayEvent('overlay:closed');
    _overlayState = 'closed';
  } else {
    const href = el.getAttribute('data-permalink');
    root.render(<BowlOverlay num={num} href={href} />);
    if (_overlayState === null) overlayEvent('overlay:loaded-open', num);
    else if (_overlayState === 'closed') overlayEvent('overlay:opened', num);
    else overlayEvent('overlay:changed', num);
    _overlayState = 'open';
  }
}
nav(window.location);
addEventListener('hashchange', e => nav(new URL(e.newURL)));
