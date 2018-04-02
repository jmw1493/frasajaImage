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

    if(!isService){
      window.location.pathname = "/not-found"
    }

    this.props.refresh();
  }

  // reset this state's url if the iframe is different
  componentDidUpdate(prevProps, prevState){
    // console.log(prevProps, this.props);
    if(prevProps.iframe !== this.props.iframe){
      this.setState({url: this.props.url});
    }
  }

  // change url back to the iframe actual src
  refresh = (e) => {
    this.setState((prevState) => {
      return {url: this.props.url}
    }, () => {
      this.props.refresh(e);
    });
  }

  // wait to refresh until the user presses enter
  changeUrl = (e) => {
    const value = e.target.value;
    this.setState((prevState) => {
      return { url: value };
    }, () => {
      console.log(e);
      // this.props.changeUrl(e)
    })
  }

  checkEnter = (e) => {
    if(e.keyCode === 13){
      this.props.changeUrl(this.state.url);
    }
  }

  render(){
    const links = this.props.services.map((service, i) => (
      <Link className={`blue-button ${(this.props.location.includes(service.NAME)) ? "blue-button-active": ""}`} to={`/service/${service.NAME}`} key={`service-link${i}`} id={i} onClick={this.props.changeScreen}>
        {service.NAME}
      </Link>
    ))

    return (
      <div className="row">
        <div className="col-tabs">
          <h1>Services</h1>
          <div className="scroll">
            {links}
          </div>
        </div>
        <div className="col">
          <div className="input">
            <input type="text" value={this.state.url} onChange={this.changeUrl} onKeyUp={this.checkEnter} />
            <a onClick={this.refresh}><img src="/refresh-button.svg" /></a>
          </div>
          <iframe className="frame" id="screen-display" src=""></iframe>
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
  changeScreen: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  changeUrl: PropTypes.func.isRequired
}

export default Services;
