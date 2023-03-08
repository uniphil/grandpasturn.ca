import React from 'react';
import ReactDOM from 'react-dom/client';
import BowlOverlay from './BowlOverlay';

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
  const el = document.querySelector(`[data-bowl='${num}'] > a`);
  if (num === undefined || el === undefined) {
    root.render(<></>);
    if (_overlayState !== null) overlayEvent('overlay:closed');
    _overlayState = 'closed';
  } else {
    root.render(<BowlOverlay num={num} href={el.href} />);
    if (_overlayState === null) overlayEvent('overlay:loaded-open', num);
    else if (_overlayState === 'closed') overlayEvent('overlay:opened', num);
    else overlayEvent('overlay:changed', num);
    _overlayState = 'open';
  }
}
Array.from(document.querySelectorAll('[data-bowl] > a')).forEach(el => el.addEventListener('click', e => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  window.location.hash = el.parentNode.getAttribute('data-bowl');
}));
nav(window.location);
addEventListener('hashchange', e => nav(new URL(e.newURL)));
