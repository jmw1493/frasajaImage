import React from "react";
import Navbar from "./Navbar";
import Screen from "./Screen";

class Main extends React.Component{

  render(){
    return (
      <div id='main'>
        <Navbar services={this.props.services} changeService={this.props.changeService} whichScreen={this.props.whichScreen}/>

        <Screen changeScreen={this.props.changeScreen} iframe={this.props.iframe} services={this.props.services} whichScreen={this.props.whichScreen}/>
      </div>
    );
  }
}

export default Main;
