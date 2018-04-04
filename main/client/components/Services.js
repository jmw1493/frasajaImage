import React from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Services extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: props.url
    }
  }

  componentDidMount(){
    // if the url does not match any of the names reroute to not-found
    const path = window.location.pathname;
    const serviceName = path.slice(path.lastIndexOf('/') + 1);
    const isService = this.props.services.reduce((bool, service) => {
      return bool || service.NAME === serviceName;
    }, false);

    if(!isService && path !== "/service/no-services"){
      // window.location.pathname = "/not-found"
      this.props.pushHistory("/service", {});
    }

    // forward console to our console
    const iframe = document.getElementById('screen-display');
    if(iframe){
      iframe.contentWindow.console.log = (val) => {
        console.log(val);
      }
    }

    this.props.refresh();
  }

  // ===================CLICKING BUTTONS==========================================
  // change the state's url to the button's rool url
  // what the url will become
  // if the url in App.js is the same, the iframe will just refresh
  changeScreen = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    const num = parseInt(e.target.id, 10);
    const newUrl = (num === this.props.iframe) ? this.props.url: `http://${window.location.hostname}${this.props.services[num].PORT}`;

    this.setState((prevState) => {
      return { url: newUrl }
    }, () => {
      this.props.changeUrl(newUrl);
    });
  }

  // change url back to the iframe actual src
  refresh = (e) => {
    if(this.props.loading){
      e.preventDefault();
      return;
    }

    this.setState((prevState) => {
      return { url: this.props.url }
    }, () => {
      this.props.refresh();
    });
  }

  // ============================INPUT FIELD=======================================
  // wait to refresh until the user presses enter
  changeUrl = (e) => {
    const value = e.target.value;
    this.setState((prevState) => {
      return { url: value };
    })
  }

  // if user pressses enter, change the iframe src in App.js
  checkEnter = (e) => {
    if(e.keyCode === 13){
      this.props.changeUrl(this.state.url);
    }
  }


  render(){
    const links = (this.props.services.length) ? this.props.services.map((service, i) => (
      <Link className={`${(this.props.location.includes(service.NAME)) ? "blue-button-active": ""} ${(this.props.loading) ? "blue-button-locked": "blue-button"}`} to={`/service/${service.NAME}`} key={`service-link${i}`} id={i} onClick={this.changeScreen}>
        {service.NAME}
      </Link>
    )): <i>No Exposed Services to Show</i>


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
            <input type="text" value={this.state.url} onChange={this.changeUrl} onKeyUp={this.checkEnter} disabled={this.props.loading}/>
            <a onClick={this.refresh}><img src="/refresh-button.svg" /></a>
          </div>
          {(this.props.loading) ?
            <iframe className="frame" src={`${window.location.origin}/loading`}></iframe>:
            <iframe className="frame" id="screen-display" src=""></iframe>
          }
        </div>
      </div>
    );
  }
}


Services.propTypes = {
  iframe: PropTypes.number.isRequired,
  services: PropTypes.arrayOf(PropTypes.shape({
    ["NAME"]: PropTypes.string.isRequired,
    ["TYPE"]: PropTypes.string.isRequired,
    ["CLUSTER-IP"]: PropTypes.string.isRequired,
    ["EXTERNAL-IP"]: PropTypes.string.isRequired,
    ["PORT(S)"]: PropTypes.string.isRequired,
    ["AGE"]: PropTypes.string.isRequired,
    ["PORT"]: PropTypes.string.isRequired
  })).isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  changeUrl: PropTypes.func.isRequired,
  pushHistory: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Services;
