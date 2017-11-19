angular.module('dashboard')
    .controller(
        'chatController', 
	['$scope', 'authService', 'socketFactory', 
	 function($scope, auth, sockets){	
	     $scope.messages = [];
	     $scope.message = "";
	     $scope.init = function(){
		 sockets.init(auth.userID());
		 sockets.on('pushNotification', function(message){
		     $scope.messages.push(message);
		 });
		 sockets.on('initializeChatHistory', function(history){
		     $scope.messages = history;
                 });
		 if($scope.messages.length === 0){
		     console.log('need to initialize');
		     sockets.emit('historyIsBlank');
		 }
	     }
	     $scope.send = function(){
		 sockets.emit('sendMessage', $scope.message);
		 $scope.message = "";
	     }
	     $scope.$on('$destroy', function(){
		 sockets.disconnect();
	     })
	 }]);
