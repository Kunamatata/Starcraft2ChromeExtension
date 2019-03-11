import React from 'react';
import ReactDOM from 'react-dom';

import config from './config/config';
import StreamList from './components/StreamList/streamlist'
import StreamSelector from './components/StreamSelector/streamselector'
class AppContainer extends React.Component {

  constructor(){
    super()
    this.state = {
      language: 'all'
    }
    this.handleChange = this.handleChange.bind(this)    
  }

  componentWillMount() {
    document.body.style.padding = 0
    document.body.style.margin = 0
    document.body.style.backgroundColor = 'black'
    document.body.style.fontFamily = "Open Sans"
  }

  handleChange(event){
    this.setState({
      language: event.target.options[event.target.options.selectedIndex].value
    })
  }

  render() {
    return (
      <div>
        <StreamSelector onChange={this.handleChange} selected={this.state.language} supportedLanguages={config.supportedLanguages}/>
        <StreamList language={this.state.language} STARCRAFT_API_URL={config.STARCRAFT_API_URL}/>
      </div>
    )
  }
}

ReactDOM.render(<AppContainer />, document.getElementById('app'))
