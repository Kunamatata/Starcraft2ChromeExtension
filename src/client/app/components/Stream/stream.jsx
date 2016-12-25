import React from 'react'

import style from './stream.styl'

const DEFAULT_LOGO = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png"

class Stream extends React.Component {

  constructor() {
    super()
    this.channelImage = {
      backgroundImage: null
    }
  }

  componentWillMount() {
    this.channelImage.backgroundImage = this.props.stream.channel.logo !== null ? `url(${this.props.stream.channel.logo})` : `url(${DEFAULT_LOGO})`
  }

  handleFavorite() {
    // Add stream to favorite with 
  }

  render() {
    return (
      <div className={style.stream}>
        <div>
          <span className={style.favoriteStar} onClick={this.handleFavorite}>⭑</span>
          <span>
            <a href={this.props.stream.channel.url} target="_blank">{this.props.stream.channel.display_name}</a> - {this.props.stream.viewers}</span>
        </div>
        <div className={style.streamDescription}>{this.props.stream.channel.status}</div>
        <div className={style.streamLogo} style={this.channelImage}></div>
      </div>
    )
  }
}

export default Stream