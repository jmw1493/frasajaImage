
const socketConnect = () => {
  return io.connect(
    window.location.origin,
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
}

export default socketConnect;
