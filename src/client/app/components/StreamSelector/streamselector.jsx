import React from 'react';

import style from './streamselector.styl';

class StreamSelector extends React.Component {

  render() {
    return (
      <div>
        <select className={style.streamSelector} onChange={this.props.onChange}>
          {this.props.supportedLanguages.map((el, index) => (
              <option key={index} value={el.abbr}>{el.caption}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default StreamSelector;
