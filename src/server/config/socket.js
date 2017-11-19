const socketHandler = require('../controllers/sockets');

module.exports = function(io){
	io.on('connection', (socket) => {
		console.log('User connected');
		socket.on('disconnect', socketHandler.disconnect);
		socket.on('clearConnection', socketHandler.clearConnection(socket));
		socket.on('setNewConnection', socketHandler.setNewConnection(socket));
		socket.on('sendMessage', socketHandler.postMessage(io, socket));
		socket.on('historyIsBlank', socketHandler.initializeChatHistory(socket));
	});
}
