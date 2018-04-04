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
    // this.updateLoadingStatus(false, this.updateServices);
    // this.changeUrl('http://192.168.64.12:31000');
    // add event listener for we receive data
    const socket = socketConnect();

    // refresh signal sent when kubernetes objects are first created
    // and after the pause before deleting
    socket.on('refresh-page', (data) => {
      // console.log('MESSAGE', data);
      this.setState((prevState) => {
        return {
          data: prevState.data.concat(data.message || [])
        }
      }, () => {
        if(data.refresh){
          if(!Object.keys(this.state.services).length) this.updateLoadingStatus(false, this.updateServices);
          else this.updateLoadingStatus(false, this.refresh);
        }
        else if(data.loading){ // sent when backend detects change and files
          this.updateLoadingStatus(true);
        }
      })
    });
  }

  updateLoadingStatus(loading, cb=()=>{}) {
    this.setState((prevState) => {
      return { loading: loading }
    }, cb)
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

  // called when clicking service link
  // and pressing enter on fake url bar
  changeUrl = (newUrl) => {
    if(this.state.loading){
      return;
    }
    this.setState((prevState) => {
      return {
        url: newUrl
      }
    }, () => {
      this.refresh();
    })
  }

  // we manually change the iframe src
  // otherwise refreshing the iframe will not work in react
  // we do keep track of the url for the url bar
  refresh = () => {
    if(!this.state.url || this.state.loading){
      return;
    }

    const iframe = document.getElementById('screen-display');
    if(!iframe){
      return;
    }

    const iframeUrl = this.state.url;
    iframe.src = iframeUrl;
  }

  clear = () => {
    if(this.state.loading){
      return;
    }
    this.setState({data: []});
  }

  render(){
    return (
      <div id="wrapper">
        <Navbar
          location={this.props.history.location.pathname}
        />
        <Main
          iframe={this.state.iframe}
          services={this.state.services}
          data={this.state.data}
          refresh={this.refresh}
          clear={this.clear}
          location={this.props.history.location.pathname}
          url={this.state.url}
          changeUrl={this.changeUrl}
          pushHistory={this.props.history.replace}
          loading={this.state.loading}
        />
      </div>
    );
  }
}


export default withRouter(App);
