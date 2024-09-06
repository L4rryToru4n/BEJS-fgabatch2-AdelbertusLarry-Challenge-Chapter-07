const { io } = require("socket.io-client");
const socketServer = io(process.env.WEB_SOCKET_URL);

module.exports = {
    socketServer
};