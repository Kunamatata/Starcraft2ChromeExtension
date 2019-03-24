import React from 'react';

import style from './streamlist.styl';
import Stream from '../Stream/stream.jsx';

class StreamList extends React.Component {
  constructor() {
    super();
    this.state = {
      streams: null,
      favoriteStreams: {},
    };
    this.abortController = new AbortController();
    this.handleFavorite = this.handleFavorite.bind(this);
  }

  componentDidMount() {
    // this.getStreamDummyList()
    chrome.storage.sync.get('favoriteStreams', (items) => {
      this.setState({ favoriteStreams: items.favoriteStreams || {} });
    });
    this.startPoll();
  }

  componentWillUnmount() {
    this.abortController.abort();
    clearTimeout(this.timer);
  }

  startPoll() {
    this.getStreamList();
    this.timer = setTimeout(() => this.startPoll(), 20000);
  }

  getStreamDummyList() {
    this.setState({
      streams: this.dummyData.streams,
    });
  }

  getStreamList() {
    fetch(this.props.STARCRAFT_API_URL, { signal: this.abortController.signal }).then((response) => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${
          response.status}`);
        return;
      }
      response.json().then((data) => {
        this.setState({
          streams: data.streams,
        });
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  handleFavorite(stream) {
    console.log(stream);
    const { favoriteStreams } = this.state;
    const { streamName } = stream.state;
    if (favoriteStreams[streamName]) {
      delete favoriteStreams[streamName];
    } else {
      favoriteStreams[streamName] = {
        streamName: stream.state.streamName,
        url: stream.state.url,
        logo: stream.state.logo,
        lastNotificationDate: Date.now(),
      };
    }
    this.setState({
      favoriteStreams,
    });

    chrome.storage.sync.set({ favoriteStreams: this.state.favoriteStreams }, () => {
      console.log('saved');
    });
  }

  render() {
    let { streams = null } = this.state;
    if (streams !== null) {
      streams = streams.filter(stream => (this.props.language === 'all' ? true : stream.channel.broadcaster_language === this.props.language));

      return (
        <div className={style.streamList}>
          {streams.length > 0 ? streams.map(stream => (
            <Stream key={stream._id} stream={stream} favorite={!!this.state.favoriteStreams[stream.channel.display_name]} handleFavorite={this.handleFavorite} />
          )) : <div className={style.noStreams}>Currently no live streams for this broadcast language</div>}
        </div>
      );
    }
    return (<div></div>);
  }
}

export default StreamList;
