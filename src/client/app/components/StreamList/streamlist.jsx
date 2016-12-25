import React from 'react'
import ReactDOM from 'react-dom'

import style from './streamlist.styl'

import Stream from '../Stream/stream.jsx'

const STARCRAFT_API = "https://kuna-starcraft2.rhcloud.com/api/sc2/streams"

class StreamList extends React.Component {
  
 constructor(){
    super()
    this.state = {
      streams: null
    }
  }

  componentWillMount() {
    this.getStreamList()
    // this.getStreamDummyList()
  }

  componentDidMount() {
    this.startPoll()
  }

  startPoll() {
    this.interval = setInterval(() => this.getStreamList(), 60000);
  }

  getStreamDummyList() {
    this.setState({
      streams: this.dummyData.streams
    })
  }

  getStreamList() {
    fetch(STARCRAFT_API).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status)
        return
      }
      response.json().then((data) => {
        this.setState({
          streams: data.streams
        })
      })
    })
  }

  render() {
    if (this.state.streams) {
      return (
        <div className={style.streamList}>
          {this.state.streams.map((stream) => {
            return (<Stream key={stream._id} stream={stream} />)
          })}
        </div>
      )
    }
    return (<div></div>)
  }
}

export default StreamList