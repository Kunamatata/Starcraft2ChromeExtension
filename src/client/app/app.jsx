import React from 'react';
import ReactDOM from 'react-dom';

import StreamList from './components/StreamList/streamlist'

class AppContainer extends React.Component {

  render() {
    return (
      <StreamList/>
    )
  }
}

ReactDOM.render(<AppContainer />, document.getElementById('app'))