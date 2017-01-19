import React from 'react'
import ReactDOM from 'react-dom'

import style from './streamlist.styl'

import Stream from '../Stream/stream.jsx'

const STARCRAFT_API = "https://kuna-starcraft2.rhcloud.com/api/sc2/streams"

class StreamList extends React.Component {

  constructor() {
    super()
    this.state = {
      streams: null,
      favoriteStreams: []
    }
    this.handleFavorite = this.handleFavorite.bind(this)
  }

  componentWillMount() {
    this.getStreamList()
    // this.getStreamDummyList()
    chrome.storage.sync.get('favoriteStreams', (items) => {
      if (items.favoriteStreams === undefined)
        items.favoriteStreams = [];
      this.setState({
        favoriteStreams: items.favoriteStreams
      });
    })
  }

  componentDidMount() {
    this.startPoll();
  }

  startPoll() {
    this.interval = setInterval(() => this.getStreamList(), 60000);
  }

  getStreamDummyList() {
    this.setState({
      streams: this.dummyData.streams
    });
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
        });
      })
    })
  }

  handleFavorite(stream) {
    let favoriteStreams = this.state.favoriteStreams;
    if (favoriteStreams.indexOf(stream.state.streamName) > -1) {
      favoriteStreams.splice(favoriteStreams.indexOf(stream.state.streamName), 1)
    }
    else {
      favoriteStreams.push(stream.state.streamName);
    }
    this.setState({
      favoriteStreams
    });
    chrome.storage.sync.set({ 'favoriteStreams': this.state.favoriteStreams }, () => {
      console.log('saved');
    });
  }

  render() {
    if (this.state.streams) {
      let streams = this.state.streams.filter((stream) => {
        return this.props.language === 'all' ? true : stream.channel.broadcaster_language === this.props.language
      })
      
      return (
        <div className={style.streamList}>
          {streams.length > 0 ? streams.map((stream) => {
            return (<Stream key={stream._id} stream={stream} favorite={this.state.favoriteStreams.indexOf(stream.channel.display_name) > -1 ? true : false} handleFavorite={this.handleFavorite} />)
          }) : <div className={style.noStreams}>Currently no live streams for this broadcast language</div>}
        </div>
      )
    }
    return (<div></div>)
  }
}

export default StreamList