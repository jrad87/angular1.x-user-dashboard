angular.module('dashboard')
    .factory('messagesFactory', 
        ['$q', '$http', function($q, $http){
            var _userMessages = []; 
            function responseData(response){
                return response.data;
            }
			function swap(array, swapWith, callback){
				let obj = array.find(callback);
				array[array.indexOf(obj)] = swapWith;
			}
			function replaceMessage(replaceWith){
				let replaceAt = _userMessages.findIndex(function(message){
					return message._id.toString() === replaceWith._id.toString();
				});
				_userMessages[replaceAt] = replaceWith;
			}
            return {
                postMessage(message, setMessages, showErrors, clearErrors){
                    $http.post('/api/messages/', message)
                        .then(responseData)
                        .then(function(message){
                            return $http.put('/api/users/messages/' + message.messageTo, message)
                                .then(responseData)
                                .then(function(user){
                                    message.messageFrom = user;
                                    _userMessages.unshift(message);
                                    clearErrors();
                                    setMessages(_userMessages);
                                }) 
                        })
                        .catch(function(errorResponse){
                            showErrors('newMessage', responseData(errorResponse));
                        })
                },
                updateMessage(message, setMessages, showErrors, clearEdit){
                    $http.put('/api/messages/' + message._id, message)
                        .then(responseData)
                        .then(function(updatedMessage){
							console.log(updatedMessage);
                            _userMessages[_userMessages.indexOf(_userMessages.find(function(_message){
                                return _message._id === message._id;
                            }))] = updatedMessage
                            setMessages(_userMessages);
                            //clearEdit(message);
                        })
                        .catch(function(errorResponse){
                            showErrors(message._id, responseData(errorResponse));
                        });
                },
                getMessages(messageIds, setMessages){
                    console.log('Getting messages', messageIds);
                    $q.all(messageIds.map(messageId => $http.get('/api/messages/' + messageId)))
                    .then(function(responses){
                        return responses.map(responseData)
                    })
                    .then(function(messages){
                        _userMessages = messages;
						console.log(messages);
                        setMessages(messages);
                    })
                    .catch(console.log);
                },
                deleteMessage(user_id, message_id, setMessages){
                    $http.delete('/api/messages/' + message_id)
                        .then(responseData)
                        .then(function(deletedMessage){
                            return $http.delete('/api/users/' + user_id + '/messages/' + message_id)
                                .then(function(){
                                    _userMessages = _userMessages.filter(function(message){
                                        return deletedMessage._id !== message._id;
                                    })
                                    setMessages(_userMessages);
                                });
                        })
                        .catch(console.log);
                },
				postComment(comment, message, setMessages, showErrors, clearView){
					$http.post('/api/comments/' + message._id, comment)
						.then(responseData)
						.then(function(commentedMessage){
							replaceMessage(commentedMessage)
							setMessages(_userMessages);
						})
						.catch(function(errorResponse){
							showErrors(errorResponse.data);
						})
				},
				deleteComment(messageId, commentId, setMessages){
					$http.delete('/api/comments/' + commentId)
						.then(responseData)
						.then(function(updatedMessage){
							replaceMessage(updatedMessage);
							setMessages(_userMessages);
						})
						.catch(console.log);
				},
				updateComment(comment, setMessages, showErrors, clearView){
					$http.put('/api/comments/' + comment._id, Object.assign(comment, {edited: true}))
						.then(responseData)
						.then(function(updatedMessage){
							replaceMessage(updatedMessage);
							setMessages(_userMessages);
						})
						.catch(function(errorResponse){
							showErrors(errorResponse.data);
						});
				},
                clearMessages(){
                    console.log("Clearing messages, $scope.$on('destroy') triggered");
                    _userMessages = [];
                }
            };
        }]);
