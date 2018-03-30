import React from "react";
import Header from "./Header";
import Main from "./Main";

const socket = io.connect(
  location.href,
  {
    transports: ['websocket'],
    upgrade: false,
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
  }
);

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      whichScreen: 'service-view',
      services: {0: '31000', 1: '31001', 2: '31002'}, //make empty after fetching services works
      iframe: 0,
      refreshBool: true,
    };
    this.data = [];
    this.changeService = this.changeService.bind(this);
    this.changeScreen = this.changeScreen.bind(this);
    this.refresh = this.refresh.bind(this);
    socket.on('refresh-page', (data) => {
      console.log('client socket receiving something', data);
      data.message.forEach((m) => {
        this.data.push(m);
      })
      //   const li = document.createElement('li');
      //   li.append(m);
      //   this.data.push(li);
      // });
      setTimeout(() => {
        this.refresh();
      }, 500);
    });
  }
  
  componentDidMount() {
    //fetch services and store them in state
    // const url = '...';
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => {
        // initial obj
        // data.serviceList.services.forEach((service, index) => {
        //   let portNum = service.internalEndpoint.ports[0].nodePort
        //   if (portNum > 0), obj[index] = portNum
        // })
        //setState({services: obj})

      //  })
    //http://192.168.64.27:30000/api/v1/overview/default?filterBy=&itemsPerPage=10&name=&page=1&sortBy=d,creationTimestamp
  }

  refresh() {
    let refreshBool = this.state.refreshBool ? false : true;
    this.setState({
      refreshBool: refreshBool,
    });
  }

  changeService(e) {
    let buttonId = e.target.id;
    this.setState({
      iframe: buttonId
    });
  }

  changeScreen(e) {
    let screen = e.target.id;
    this.setState({
      whichScreen: screen
    });
  }

  render(){
    return (
      <div id='wrapper'>
        <Header/>
        <Main 
          whichScreen={this.state.whichScreen}
          services={this.state.services}
          iframe={this.state.iframe}
          changeService={this.changeService}
          changeScreen={this.changeScreen}
          refresh={this.refresh}
          data={this.data}
        />
      </div>
    );
  }
}

export default App;
