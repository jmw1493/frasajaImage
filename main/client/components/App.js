import React from "react";
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

import Main from "./Main";
import Navbar from "./Navbar";
import socketConnect from "../socket.js";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      services: [], // make empty after fetching services works
      whichService: { // shows which service we are display in the iframe
        service: 0,
        port: 0,
        url: `${window.location.origin}/loading` // url is separate because user may make some modifications in url bar
      },
      data: [],
      loading: true
    };
  }

  componentDidMount() {
    // this.updateServices();
    // add event listener for we receive data
    const socket = socketConnect();

    // refresh signal sent when kubernetes objects are first created
    // and after the pause before deleting
    // on refresh reset the loading status to false
    // if no services get a list of services which updates the currently used service and update iframe
    // else just refresh the iframe

    socket.on('refresh-page', (data) => {
      console.log(data);
      this.setState((prevState) => {
        return {
          data: prevState.data.concat(data.message || [])
        }
      }, () => {
        if(data.refresh){
          if(!Object.keys(this.state.services).length) this.updateServices();
          else this.updateLoadingStatus(false);
        }
        else if(data.loading){ // sent when backend detects change and files
          this.updateLoadingStatus(true);
        }
      })
    });
  }

  // ==================in response to web socket==================================
  // changes loading status
  // if loading is true, iframe src is set the default '/loading' endpoint;
  // else iframe src is set to
  updateLoadingStatus(loading) {
    this.setState((prevState) => {
      return { loading: loading }
    }, () => { this.refresh(); })
  }

  // fetch services and store them in state
  updateServices = () => {
    const url = '/services';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => {
          const url = (data.services.length) ?
            `http://${window.location.hostname}${data.services[0].PORT[0]}`:
            '';

          return {
            services: data.services,
            whichService: {
              service: 0,
              port: 0,
              url: url
            },
            loading: false
          }
        }, () => {
          if(this.props.history.location.pathname.includes('service')){
            if(this.state.services.length){
              const currentService = this.state.services[this.state.whichService.service];
              this.props.history.replace(`/service/${currentService.NAME}${currentService.PORT[this.state.whichService.port]}`, {})
            }
            else {
              this.props.history.replace("/service/no-services", {})
            }
          }
          this.refresh();
        })
      })
  }

  // ================in response to user input==========================
  // called when clicking service link
  // and when typeing into fake url bar
  // cb only used to refresh when clicking service link
  changeUrl = (service, port, newUrl, cb=()=>{}) => {
    if(this.state.loading){
      return;
    }

    this.setState((prevState) => {
      return {
        whichService: {
          service: service,
          port: port,
          url: newUrl
        }
      }
    }, cb)
  }

  clear = () => {
    if(this.state.loading){
      return;
    }
    this.setState({data: []});
  }

  // ==================callback for user input and web socket============================
  // we manually change the iframe src
  // otherwise refreshing the iframe will not work in react
  // we do keep track of the url for the url bar
  refresh = () => {
    const iframe = document.getElementById('screen-display');
    if(!iframe){
      return;
    }

    iframe.src = (this.state.loading || !this.state.services.length || !this.state.whichService.url) ?
      `${window.location.origin}/loading`:
      this.state.whichService.url;
  }


  render(){
    return (
      <div id="wrapper">
        <Navbar
          location={this.props.history.location.pathname}
        />
        <Main
          services={this.state.services}
          whichService={this.state.whichService}
          data={this.state.data}
          loading={this.state.loading}

          changeUrl={this.changeUrl}
          clear={this.clear}
          refresh={this.refresh}

          pushHistory={this.props.history.replace}
          location={this.props.history.location.pathname}
        />
      </div>
    );
  }
}


export default withRouter(App);
