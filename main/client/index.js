import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import style from "./style/index.scss";

// =====================================================
const url = "http://" + window.location.hostname + ":31000";
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

const add = document.getElementById("my-list");
const button = document.getElementById("refresh");

const frame = document.getElementById("my-frame");
frame.src = url;

button.addEventListener('click', function(){
  frame.src = url
})

socket.on('refresh-page', (data) => {
  console.log('client socket receiving something', data);
  setTimeout(() => {
    frame.src = url;
  }, 500)

  data.message.forEach((m) => {
    const li = document.createElement('li');
    li.append(m);
    add.append(li);
  })
});
// ====================================================

ReactDOM.render(<App/>, document.getElementById('root'))
