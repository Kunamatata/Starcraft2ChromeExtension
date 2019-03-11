import React from 'react'

import style from './stream.styl'

const DEFAULT_LOGO = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png"

class Stream extends React.Component {

  constructor() {
    super()
    this.channelImage = {
      backgroundImage: null
    }
    this.raceImage = {
      backgroundImage: null
    }
    this.state = {
      streamName: ''
    }
  }

  componentWillMount() {
    this.channelImage.backgroundImage = this.props.stream.channel.logo !== null ? `url(${this.props.stream.channel.logo})` : `url(${DEFAULT_LOGO})`
    this.mapRace()

    this.setState({
      streamName: this.props.stream.channel.display_name
    })
  }


  mapRace() {
    let race = this.props.stream.channel.status.match(/protoss|zerg|terran|toss/ig)
    race = race ? race[0].toLowerCase() : ''
    if (race)
      switch (race) {
        case 'protoss':
          this.raceImage.backgroundImage = `url(${require('../../assets/protoss.png')})`
          break;
        case 'zerg':
          this.raceImage.backgroundImage = `url(${require('../../assets/zerg.png')})`
          break;
        case 'terran':
          this.raceImage.backgroundImage = `url(${require('../../assets/terran.png')})`
          break;
      }
    else {
      this.raceImage.width = 0
      this.raceImage.height = 0
      this.raceImage.display = "none"
    }
  }

  render() {
    return (
      <div className={style.stream} data-stream-name={this.props.stream.channel.display_name}>
        <div className={style.username}>
          <span className={this.props.favorite === true ? style.favoriteStar + ' ' + style.active : style.favoriteStar} onClick={() => this.props.handleFavorite(this)}>⭑</span>
          <span>
            <a href={this.props.stream.channel.url} target="_blank">{this.props.stream.channel.display_name}</a> - {this.props.stream.viewers}</span>
        </div>
        <div className={style.streamDescription}>{this.props.stream.channel.status}</div>
        <div className={style.streamLogo} style={this.channelImage}></div>
        <div className={style.raceImage} style={this.raceImage}></div>
      </div>
    )
  }
}

export default Stream