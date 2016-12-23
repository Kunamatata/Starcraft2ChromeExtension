import React from 'react'
import ReactDOM from 'react-dom'

import style from './stream.styl'

class StreamList extends React.Component {

  constructor() {
    super()
  }

  render() {
    console.log(this.props.streams)
    if (this.props.streams) {
      return (
        <div>
          {this.props.streams.map((stream) => {
            return (<Stream key={stream._id} stream={stream} />)
          })}
        </div>
      )
    }
    return (<div></div>)
  }
}

function Stream(props) {
  return (
    <div className={style.stream}>
      <div className="stream-name">{props.stream.channel.display_name}</div>
      <div className="stream-viewers">{props.stream.viewers}</div>
      <div className="stream-title">{props.stream.channel.status}</div>
    </div>
  )
}

export default StreamList