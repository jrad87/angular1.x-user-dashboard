const io = require('socket.io-client');

angular.module('dashboard')
    .factory('socketFactory', ['$rootScope', function($rootScope){
	var socket;
	return {
	    init(currentUser){
		socket = io.connect();
		socket.on('connect', function(){	
		    socket.emit('setNewConnection', {u_id: currentUser, s_id: socket.id});
		});
	    },
	    disconnect(){
		socket.emit('clearConnection', socket.id);
		socket.disconnect();
	    },
	    on(eventName, callback){
		socket.on(eventName, function(){
		    var args = arguments;
		    $rootScope.$apply(function(){
			callback.apply(socket, args);
		    })
		});
	    },
	    emit(eventName, data, callback){
		socket.emit(eventName, data, function(){
		    var args = arguments;
		    $rootScope.$apply(function(){
			if (callback){
			    callback.apply(socket, args);
			}
		    });
		});
	    },
	}
    }]);
