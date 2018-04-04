import React from "react";
import PropTypes from 'prop-types';

const getClass = (d) => {
  if(!d){
    return "";
  }
  if(d.includes('stderr')){
    return "err";
  }
  if(d[0] === "$"){
    return "command";
  }
  return "";
}

const Terminal = (props) => {
  return (
    <div className="row">
      <div className="col-tabs">
        <h1>Terminal</h1>
        <div className="scroll">
          <a className={(props.loading) ? "blue-button-locked": "blue-button"} onClick={props.clear}>Clear</a>
          <a className={(props.loading) ? "blue-button-locked": "blue-button"} onClick={(e) => { window.location.reload(true); }}>Rebuild</a>
        </div>
      </div>
      <div className="col">
        <div className="frame" id="terminal">
          {props.data.map((d, i) => (
            <p key={`output${i}`} className={getClass(d)}>{d}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

Terminal.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  clear: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Terminal;
