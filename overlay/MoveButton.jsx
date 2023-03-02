import React from 'react';

const MoveButton = ({ n, dir, goto }) => (
  <button
    onClick={() => goto(n)}
    className={`reset pointer move ${dir}`}
    title={`Bowl #${n}`}
    disabled={!n}>
    {n || '-'}
  </button>
);

export default MoveButton;
