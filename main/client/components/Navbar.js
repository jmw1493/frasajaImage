import React from "react";

class Navbar extends React.Component{

  render(){
    let serviceArr = [];
    if (this.props.whichScreen === 'service-view') {
      this.props.services.forEach((service, index) => {
        serviceArr.push(
          <button 
            key={index} 
            id={index} 
            class='service-button' 
            onClick={this.props.changeService}
          >
            service {index}
          </button>
        );
      });
    }
    return (
      <nav>
        <h1>Navbarrrr</h1>
        <div id='service-list'>
          {serviceArr}
        </div>
      </nav>
    );
  }
}

export default Navbar;
