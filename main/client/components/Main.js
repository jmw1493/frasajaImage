import React from "react";
import { Route, Switch, Redirect } from 'react-router'
import PropTypes from 'prop-types';

import Services from "./Services";
import Terminal from "./Terminal";
import NotFound from "./NotFound";


class Main extends React.Component {

  render(){
    // <Route path="/service/no-services" render={() => ( <h1>No Exposed Services</h1> )} />
    const defaultServiceName = (this.props.services.length) ? this.props.services[this.props.iframe]["NAME"]: "no-services";

    return (
      <div id="main">
        <Switch>
          <Route exact path="/" render={() => ( <Redirect to={(this.props.services.length) ? `/service/${defaultServiceName}`: "/terminal"} /> )} />
          <Route exact path="/service" render={() => ( <Redirect to={`/service/${defaultServiceName}`}/> )} />
          <Route path="/service/:serviceName" render={() => (
            <Services
              iframe={this.props.iframe}
              services={this.props.services}
              refresh={this.props.refresh}
              location={this.props.location}
              url={this.props.url}
              changeUrl={this.props.changeUrl}
              pushHistory={this.props.pushHistory}
              loading={this.props.loading}
            />)}
          />
          <Route path="/terminal" render={() => (
            <Terminal
              data={this.props.data}
              clear={this.props.clear}
              loading={this.props.loading}
            />)}
          />
          <Route path="/not-found" component={NotFound} />
          <Route render={() => <Redirect to="/not-found"/>} />
        </Switch>
      </div>
    )
  }
}

Main.propTypes = {
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
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeUrl: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  pushHistory: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Main;
