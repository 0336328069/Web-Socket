import SocketIO from 'socket.io-client';

const socketConnection = SocketIO("http://localhost:5000", { autoConnect : false });

export default socketConnection;