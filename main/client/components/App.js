import React from "react";
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

import Main from "./Main";
import Navbar from "./Navbar";
import socketConnect from "../socket.js";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      services: [], //make empty after fetching services works
      iframe: 0,
      data: [],
      loading: true,
      url: ''
    };
  }

  componentDidMount() {
    // add event listener for we receive data
    const socket = socketConnect();

    // refresh signal sent when kubernetes objects are first created
    // and after the pause before deleting
    socket.on('refresh-page', (data) => {
      // console.log('MESSAGE', data);
      this.setState((prevState) => {
        return {
          data: prevState.data.concat(data.message)
        }
      }, () => {
        if(data.refresh){
          if(!Object.keys(this.state.services).length){
            this.updateServices()
          }
          else {
            this.refresh();
          }
        }
      })
    });
  }

  // fetch services and store them in state
  updateServices = () => {
    const url = '/services';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => {
          const url = (data.services.length) ?
            `http://${window.location.hostname}${data.services[prevState.iframe].PORT}`:
            '';

          return {
            services: data.services,
            url: url
          }
        }, () => { this.refresh(); })
      })
  }

  // we manually change the iframe src
  // otherwise refreshing the iframe will not work in react
  // we do keep track of the url for the url bar
  refresh = () => {
    // if(!this.state.services.length || this.state.iframe >= this.state.services.length){
    //   return;
    // }
    if(!this.state.url){
      return;
    }

    const iframe = document.getElementById('screen-display');
    if(!iframe){
      return;
    }

    // const iframePort = this.state.services[this.state.iframe].PORT;
    // const iframeUrl = "http://" + window.location.hostname + iframePort;
    const iframeUrl = this.state.url;
    iframe.src = iframeUrl;
  }

  clear = () => {
    this.setState({data: []});
  }

  // called when clicking service link
  changeScreen = (e) => {
    const screen = parseInt(e.target.id, 10);
    this.setState((prevState) => {
      const url = (!prevState.services.length || screen >= prevState.services.length) ?
        '':
        `http://${window.location.hostname}${prevState.services[screen].PORT}`

      return {
        iframe: screen,
        url: url
      }
    }, () => {
      this.refresh();
    });
  }

  changeUrl = (newUrl) => {
    // const newUrl = e.target.value;
    this.setState((prevState) => {
      return {
        url: newUrl
      }
    }, () => {
      this.refresh();
    })
  }

  render(){
    console.log(this.state);
    return (
      <div id="wrapper">
        <Navbar
          location={this.props.history.location.pathname}
        />
        <Main
          iframe={this.state.iframe}
          services={this.state.services}
          data={this.state.data}
          changeScreen={this.changeScreen}
          refresh={this.refresh}
          clear={this.clear}
          location={this.props.history.location.pathname}
          url={this.state.url}
          changeUrl={this.changeUrl}
        />
      </div>
    );
  }
}


export default withRouter(App);
