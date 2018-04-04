import React from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Frame from "./Frame.js";

class Services extends React.Component {

  componentDidMount(){
    // if the url does not match any of the names reroute to not-found
    const path = this.props.location.replace('/service/', '').split(':'); // ie /service/my-service-2:30107
    if(path.length < 2) return; // from no-service

    if(!this.props.services.length){
      this.props.pushHistory("/service/no-services", {});
      return;
    }

    // find service and port
    const urlServiceName = path[0];
    const urlPort = path[1];
    const propsServiceName = this.props.services[this.props.whichService.service]["NAME"];
    const propsPort = this.props.services[this.props.whichService.service]["PORT"][this.props.whichService.port];

    // (1) make sure service and port matches any of the services
    // otherwise reroute to the default
    let serviceIndex = -1;
    let portIndex = -1;

    this.props.services.forEach((service, i) => {
      const servicePortIndex = service.PORT.indexOf(urlPort);
      if(service.NAME === urlServiceName && servicePortIndex > 0){
        serviceIndex = i;
        portIndex = servicePortIndex;
      }
    })

    if(serviceIndex < 0 || portIndex < 0){
      this.props.pushHistory(`/service/${propsServiceName}${propsPort}`, {}); // will reroute to default based on props
      return;
    }

    // (2) once we know the url service exists,
    // see if url matches the provided props
    // if not set whichService to match the url
    if(urlServiceName !== propsServiceName || urlPort !== propsPort){
      this.props.changeUrl(serviceIndex, portIndex, `http://${window.location.hostname}${urlPort}`)
    }

    // forward console to our console
    // const iframe = document.getElementById('screen-display');
    // if(iframe){
    //   iframe.contentWindow.console.log = (val) => {
    //     console.log(val);
    //   }
    // }

    this.props.refresh();
  }

  // ===================CLICKING BUTTONS==========================================
  // change the state's url to the button's rool url
  // what the url will become
  handleLinkClick = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    const serviceIndex = parseInt(e.target.id, 10);
    const portIndex = parseInt(e.target.name, 10);
    const port = this.props.services[serviceIndex]["PORT"][portIndex];
    const newUrl = `http://${window.location.hostname}${port}`;

    this.props.changeUrl(serviceIndex, portIndex, newUrl, this.props.refresh);
  }

  // change url back to the iframe actual src
  handleRefreshClick = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    this.props.refresh();
  }

  // ============================INPUT FIELD=======================================
  // wait to refresh until the user presses enter
  handleInputChange = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    const value = e.target.value;
    const currentService = this.props.whichService;
    this.props.changeUrl(currentService.service, currentService.port, value)
  }

  // if user pressses enter, change the iframe src in App.js
  checkEnter = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    if(e.keyCode === 13){
      this.props.refresh();
    }
  }


  render(){
    const links = (this.props.services.length) ? this.props.services.map((service, i) => {
      return (
        <span key={`service-link${i}`}>
          {service.PORT.map((port, j) => (
            <Link
              className={`${(i === this.props.whichService.service && j === this.props.whichService.port) ? "blue-button-active": ""} ${(this.props.loading) ? "blue-button-locked": "blue-button"}`}
              to={`/service/${service.NAME}${port}`}
              key={`port${i}${j}`}
              id={i}
              name={j}
              onClick={this.handleLinkClick}
            >
              {`${service.NAME}${port}`}
            </Link>
          ))}
        </span>);
    }): <i>No Exposed Services to Show</i>


    return (
      <div className="row">
        <div className="col-tabs">
          <h1>Services</h1>
          <div className="scroll">
            {links}
          </div>
        </div>
        <div className="col">
          <div className={(this.props.loading) ? "input locked": "input"}>
            <input type="text" value={this.props.whichService.url} onChange={this.handleInputChange} onKeyUp={this.checkEnter} disabled={this.props.loading}/>
            <a onClick={this.handleRefreshClick}><img src="/refresh-button.svg" /></a>
          </div>
          <Frame url={this.props.whichService.url}/>
        </div>
      </div>
    );
  }
}


Services.propTypes = {
  services: PropTypes.arrayOf(PropTypes.shape({
    ["NAME"]: PropTypes.string.isRequired,
    ["TYPE"]: PropTypes.string.isRequired,
    ["CLUSTER-IP"]: PropTypes.string.isRequired,
    ["EXTERNAL-IP"]: PropTypes.string.isRequired,
    ["PORT(S)"]: PropTypes.string.isRequired,
    ["AGE"]: PropTypes.string.isRequired,
    ["PORT"]: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  })).isRequired,
  whichService: PropTypes.shape({
    service: PropTypes.number.isRequired,
    port: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.string.isRequired,

  changeUrl: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,

  pushHistory: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Services;
