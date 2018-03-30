import React from "react";
import Navbar from "./Navbar";
import Screen from "./Screen";

class Main extends React.Component{

  render(){
    return (
      <div id='main'>
        <Navbar 
          whichScreen={this.props.whichScreen}
          services={this.props.services}  
          changeService={this.props.changeService} 
        />
        <Screen 
          whichScreen={this.props.whichScreen}
          services={this.props.services}
          iframe={this.props.iframe}
          changeScreen={this.props.changeScreen}
          refresh={this.props.refresh}
          data={this.props.data}
        />
      </div>
    );
  }
}

export default Main;
