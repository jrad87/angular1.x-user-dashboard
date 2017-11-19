const User = require('mongoose').model('User');
const ChatMessage = require('mongoose').model('ChatMessage');
const socketPool = {};

module.exports = {
    disconnect(){
	console.log('User disconnected');
    },
    clearConnection(socket){
	return function(s_id){
	    socket.broadcast.emit('pushNotification',`${socketPool[s_id].username} has left`);
	    delete socketPool[s_id];
            if(Object.keys(socketPool).length === 0){
                ChatMessage.clearHistory().exec();
            }
	}
    },
    setNewConnection(socket){
	return function(data){
	    User.findById(data.u_id)
		.select('-password')
		.then(user => {
		    socketPool[data.s_id] = user;
		    const text = `${user.username} has joined`;		    
		})
		.catch(console.log);
	}
    },
    postMessage(io, socket){
	return function(message){
	    ChatMessage.create({user: socketPool[socket.id], text: message})
		.then(chatMessage => {
		    io.sockets.emit('pushNotification', `${socketPool[socket.id].username}: ${message}`);
		})
		.catch(console.log);
	}
    },
    initializeChatHistory(socket){
	return function(){
	    ChatMessage.getPartialHistory()
		.then(history => {		    
		    socket.emit('initializeChatHistory', history);
		})
	}
    }
}
