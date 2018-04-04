import React from "react";
import { Route, Switch, Redirect } from 'react-router'
import PropTypes from 'prop-types';

import Services from "./Services";
import Terminal from "./Terminal";


class Main extends React.Component {

  render(){
    const serviceIndex = this.props.whichService.service;
    const portIndex = this.props.whichService.port;

    // default to something like `my-service-2:30107`
    const defaultServiceName = (this.props.services.length) ? this.props.services[serviceIndex]["NAME"]+this.props.services[serviceIndex]["PORT"][portIndex]: "no-services";

    return (
      <div id="main">
        <Switch>
          <Route exact path="/terminal" render={() => (
            <Terminal
              data={this.props.data}
              loading={this.props.loading}

              clear={this.props.clear}
            />)}
          />
          <Route exact path="/service/:serviceName" render={() => (
            <Services
              services={this.props.services}
              whichService={this.props.whichService}
              loading={this.props.loading}

              changeUrl={this.props.changeUrl}
              refresh={this.props.refresh}

              pushHistory={this.props.pushHistory}
              location={this.props.location}
            />)}
          />
          <Route render={() => ( <Redirect to={`/service/${defaultServiceName}`}/> )} />
        </Switch>
      </div>
    )
  }
}

Main.propTypes = {
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
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,

  changeUrl: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,

  pushHistory: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired // ie /service/my-service-2:30107
}

export default Main;
