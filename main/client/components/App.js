import React from "react";
import Header from "./Header";
import Main from "./Main";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      whichScreen: 'service',
      services: {0: '31000', 1: '31001', 2: '31002'}, //make empty after fetching services works
      iframe: 0
    };
    this.changeService = this.changeService.bind(this);
    this.changeScreen = this.changeScreen.bind(this);
  }

  componentDidMount() {
    //fetch services, store them in state, then pass them down to navbar
  }

  changeService(e) {
    let buttonId = e.target.id;
    this.setState({
      iframe: buttonId
    });
  }

  changeScreen(e) {
    let screen = e.target.id;
    this.setState({
      whichScreen: screen
    });
  }

  render(){
    return (
      <div id='wrapper'>
        <Header/>
        <Main services={this.state.services} changeService={this.changeService} changeScreen={this.changeScreen} iframe={this.state.iframe} whichScreen={this.props.whichScreen}/>
      </div>
    );
  }
}

export default App;
