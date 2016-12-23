import React from 'react';
import ReactDOM from 'react-dom';

import StreamList from './components/StreamList/stream'

import style from './components/StreamList/stream'

import dummyData from './data/streams/data'


class AppContainer extends React.Component {

  constructor(){
    super()
    this.state = {
      streams: null
    }
  }

  componentWillMount() {
    this.getStreamList()
    console.log(this)
    
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
    fetch('https://kuna-starcraft2.rhcloud.com/api/sc2/streams').then((response) => {
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
    return (
      <StreamList streams={this.state.streams}/>
    )
  }
}

ReactDOM.render(<AppContainer />, document.getElementById('app'))