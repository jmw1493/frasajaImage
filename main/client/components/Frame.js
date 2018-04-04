import React from "react";
import PropTypes from 'prop-types';

class Frame extends React.Component {
  shouldComponentUpdate(){
    return false;
  }

  render(){
    return (
      <iframe
        className="frame"
        id="screen-display"
        src={this.props.url}
      ></iframe>
    )
  }
}

Frame.propTypes = {
  url: PropTypes.string.isRequired
}

export default Frame;
