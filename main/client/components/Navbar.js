import React from "react";

class Navbar extends React.Component{

  render() {
    const headerArr = [], serviceArr = [];
    if (this.props.whichScreen === 'service-view') {
      headerArr.push(
      <div id='service-header'>
        <h1 key={20}>Services</h1>
      </div>
    );
      Object.keys(this.props.services).forEach((service, index) => {
        serviceArr.push(
          <button 
            key={index} 
            id={index} 
            className='service-button' 
            onClick={this.props.changeService}
          >
            service {index}
          </button>
        );
      });
    }
    return (
      <nav>
        {headerArr}
        <div id='service-list'>
          {serviceArr}
        </div>
      </nav>
    );
  }
}

export default Navbar;
