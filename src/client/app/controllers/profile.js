angular.module('dashboard')
    .controller('profileController', 
        ['$scope', '$routeParams', 'authService', 'usersFactory', 'messagesFactory', 'socketFactory', 
            function($scope, $routeParams, auth, uFactory, mFactory, sFactory){
				function getMessages(){
					uFactory.show($routeParams.id, viewUser(mFactory.getMessages));
				}
				
				$scope.show = function(){
                    init();
                    getMessages();
                };
					
				sFactory.on('profileChanged', getMessages)

                $scope.postMessage = function(){
                    $scope.message.messageTo = $routeParams.id;
                    mFactory.postMessage($scope.message, setMessages, showErrors, clearErrors);
                }

                $scope.deleteMessage = function(messageId){
                    mFactory.deleteMessage($routeParams.id, messageId, setMessages);
                }
				
				$scope.deleteComment = function(messageId, commentId){
					mFactory.deleteComment(messageId, commentId, setMessages)
				}

				$scope.editMessage = function(message){
                    message.editing = true;    
                }

				$scope.editComment = function(comment){
					comment.editing = true;
				}

                $scope.saveMessageEdit = function(message){
					console.log(message)
                    mFactory.updateMessage(message, setMessages, showErrors)
                }
                
				$scope.postComment = function(message, comment){
					mFactory.postComment(comment, message, setMessages, function(error){
						$scope.commentBuffers[message._id].errors = Array.isArray(error) ? error : [error];
					}, function(){
						message.commenting = false;
						delete $scope.commentBuffers[message._id];
					})
				}

				$scope.saveCommentEdit = function(comment){
					mFactory.updateComment(comment, setMessages, function(error){
						$scope.errors.comments[comment._id] = Array.isArray(error) ? error : [error];
					}, function(){
						
					});	
				}
				
				$scope.cancelMessageEdit = function(buffer, message){
					message.text = buffer;
					clearMessageEdit(message);
                }
				
				$scope.cancelCommentEdit = function(buffer, comment){
					comment.text = buffer;
					clearCommentEdit(comment);
				}
                
				$scope.writeComment = function(message){
					message.commenting = true;
					setCommentBuffer(message._id, {});
					console.log(message);
				}
				
				$scope.cancelComment = function(message){
					message.commenting = false;
					clearCommentBuffer(message._id);
				}

				$scope.$on('$destroy', function(){
                    mFactory.clearMessages();
                });
				
                function init(){
                    $scope.message = {};
					$scope.commentBuffers = {};
                    $scope.errors = {comments: {}}
                    $scope.userID = auth.userID();
                }
				
				function setCommentBuffer(message_id, value){
					$scope.commentBuffers[message_id] = value;
					//console.log($scope.commentBuffers);
				}

				function clearCommentBuffer(message_id){
					delete $scope.commentBuffers[message_id];
				}
				
				function clearCommentBufferErrors(message_id){
					delete $scope.commentBuffers[message_id].errors;
				}

                function setMessages(messages){
                    console.log(Object.assign({}, $scope.commentBuffers));
					$scope.messages = messages.map(function(message){
                        if($scope.userID === message.messageFrom._id){
                            message.editing = false;
                        }
                        return message;
                    });
                    $scope.message = {};
                }
				
				function setComments(message, comments){
					message.comments = comments;
				}

				function clearErrors(){
                    $scope.errors = {comments: {}};
                }
                
				function clearMessageEdit(message){
					message.editing = false;
					delete $scope.errors[message._id];
                }

				function clearCommentEdit(comment){
					comment.editing = false;
				}
                
				function showErrors(key, error){
                    $scope.errors[key] = Array.isArray(error) ? error : [error];
					console.log($scope.errors);
                }
                
				function viewUser(getMessages){
                    return function(user){
                        $scope.viewedUser = user;
                        getMessages(user.messagesTo, setMessages);
                    }
                }
            }
        ]
    );
