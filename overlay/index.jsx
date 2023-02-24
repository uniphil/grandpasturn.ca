import React from 'react';
import ReactDOM from 'react-dom/client';

class Overlay extends React.Component {
  render() {
    return <div>test test... bowl #{this.props.bowl}</div>;
  }
}

ReactDOM
    .createRoot(document.getElementById('hi-app'))
    .render(<Overlay bowl="1" />);
