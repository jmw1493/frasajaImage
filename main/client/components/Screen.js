import React from "react";

class Screen extends React.Component{

  render() {   
    //just have to make the li's real li's somehow (not strings)
    let dataArr = [];
    this.props.data.forEach((m) => {
      dataArr.push(<li>{m}</li>);
    });
    //conditional render depending on this.props.whichScreen  
    let extraDiv = [];
    switch(this.props.whichScreen) {
      case 'service-view':
        let iframePort = this.props.services[this.props.iframe];
        let iframeUrl = "http://" + window.location.hostname + ':' + iframePort;
        extraDiv.push(
          <iframe key={15} id='screen-display' src={iframeUrl}></iframe>
        );
        break;
      case 'terminal-output':
        extraDiv.push(
          <div key={16} id='screen-display'>
            <ul id='ul-data'>
              {dataArr}
            </ul>
          </div>
        );
        break;
      case 'visualizer':
        extraDiv.push(
          //plain div for now
          <div key={17} id='screen-display'></div>
        );
        break;
    }
    return (
      <div id='screen'>
        <div id='above-iframe'>
          <div id='tabs'>
            <button key={10} id='service-view' onClick={this.props.changeScreen}>Service View</button>
            <button key={11} id='terminal-output' onClick={this.props.changeScreen}>Terminal Output</button>
            <button key={12} id='visualizer' onClick={this.props.changeScreen}>Visualizer</button>
          </div>
          <button id="refresh" onClick={this.props.refresh}>refresh</button>
        </div>
      
        {extraDiv}

      </div>
    );
  }
}

export default Screen;
