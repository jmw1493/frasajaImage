import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const paths = {
  "/service": "Service View",
  "/terminal": "Terminal Output"
};

const Navbar = (props) => {
  return (
    <nav id='above-iframe'>
      <ul>
        <img src="/network.svg" />
        {Object.keys(paths).map((path) => (
          <li key={path}>
            <Link
              name={path}
              className={(props.location.includes(path)) ? "activeLink": ""}
              to={path}
            >
              {paths[path]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}


Navbar.propTypes = {
  location: PropTypes.string.isRequired
}

export default Navbar;
