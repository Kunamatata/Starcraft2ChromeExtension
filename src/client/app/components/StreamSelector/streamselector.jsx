import React from 'react';
import ReactDOM from 'react-dom';

import style from './streamselector.styl'

const supportedLanguages = [
  { abbr: 'all', caption: "All" },
  { abbr: "en", caption: "English" },
  { abbr: "fr", caption: "French" },
  { abbr: "pl", caption: "Polish" },
  { abbr: "de", caption: "German" },
  { abbr: "es", caption: "Spanish" },
  { abbr: "zh", caption: "Chinese" },
  { abbr: "ru", caption: "Russian" },
  { abbr: "nl", caption: "Dutch" }
]

class StreamSelector extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <select className={style.streamSelector} onChange={this.props.onChange}>
          {supportedLanguages.map((el,index) => {
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