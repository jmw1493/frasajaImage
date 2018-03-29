import React from "react";

class Screen extends React.Component{

  render(){   
    //conditional render depending on this.props.whichScreen  
    let extraDiv = [];
    switch(this.props.whichScreen) {
      case 'service-view':
        let iframePort = this.props.service[this.props.iframe];
        let iframeUrl = "http://" + window.location.hostname + iframePort;
        extraDiv.push(
          <iframe id='screen-display' src={iframeUrl}></iframe>
        );
      case 'console':
        extraDiv.push(
          //plain div for now
          <div id='screen-display'></div>
        );
      case 'visualizer':
        extraDiv.push(
          //plain div for now
          <div id='screen-display'></div>
        );
    }
    return (
      <div id='screen'>
        <div id='above-iframe'>
          <div id='tabs'>
            <button id='service-view' onClick={this.props.changeScreen}>Service View</button>
            <button id='console' onClick={this.props.changeScreen}>Console</button>
            <button id='visualizer' onClick={this.props.changeScreen}>Visualizer</button>
          </div>
          <button id="refresh">refresh</button>
        </div>
      
        {extraDiv}

        {/* src changes based on state's iframe property... do a conditional here?*/}
        {/* <iframe id="screen-display" src={iframeUrl}></iframe> */}
        {/* <ul id="my-list"></ul> */}
      </div>
    );
  }
}

export default Screen;
