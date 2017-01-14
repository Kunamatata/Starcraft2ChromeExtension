import React from 'react';
import ReactDOM from 'react-dom';

class StreamSelector extends React.Component {
  
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <select onChange={this.props.onChange}>
          <option value="all">All</option>
          <option value="fr">French</option>
          <option value="en">English</option>
        </select>
      </div>
    )
  }
}

export default StreamSelector