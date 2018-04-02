import React from "react";
import PropTypes from 'prop-types';

const Terminal = (props) => {
  return (
    <div className="row">
      <div className="col-tabs">
        <h1>Terminal</h1>
        <div className="scroll">
          <a className="blue-button">Clear</a>
        </div>
      </div>
      <div className="col">
        <div className="frame" id="terminal">
          {props.data.map((d, i) => (
            <p key={`output${i}`}>{d}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

Terminal.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string)
}

export default Terminal;
