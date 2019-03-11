import React from 'react';

import style from './streamselector.styl'

class StreamSelector extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <select className={style.streamSelector} onChange={this.props.onChange}>
          {this.props.supportedLanguages.map((el, index) => {
            return (
              <option key={index} value={el.abbr}>{el.caption}</option>
            )
          })}
        </select>
      </div>
    )
  }
}

export default StreamSelector