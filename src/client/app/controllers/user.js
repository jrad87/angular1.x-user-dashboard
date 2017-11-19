angular.module('dashboard')
	.controller('userController', 
		['$scope', '$routeParams', 'usersFactory', 
			function($scope, $routeParams, uFactory){
				$scope.viewUser = function(){
					clearErrors();
					uFactory.show($routeParams.id, setUser);
				}
				
				$scope.editInfo = function(){
					let user = {
						firstName: $scope.firstName,
						lastName: $scope.lastName
					}
					uFactory.update(
						$routeParams.id, 
						user, 
						setUser,
						showErrors('editInfo'),
						setMessages('Successfully updated personal information')
					);
				}
				
				$scope.editPassword = function(){
					let user = {
						password: $scope.password,
						confirmPW: $scope.confirmPW
					}	
					uFactory.update(
						$routeParams.id,
						user,
						setUser,
						showErrors('editPassword'),
						setMessages('Successfully updated password')
					)
				}
				
				$scope.editDescription = function(){
					let user = {
						description: $scope.description
					};	
					uFactory.update(
						$routeParams.id,
						user,
						setUser,
						showErrors('editDescription'),
						setMessages('Successfully updated description')
					);
				}
				
				function setUser(user){
					$scope.firstName = user.firstName;
					$scope.lastName = user.lastName;
					$scope.password = "";
					$scope.confirmPW = "";
					$scope.description = {
						text: user.description.text,
						modified: true
					};
				}
				
				function setMessages(messages){
					return function(){
						clearErrors();
						$scope.messages = Array.isArray(messages) ? messages : [ messages ]
					}
				}

				function clearMessages() {
					$scope.messages = [];
				}

				function clearErrors(){
					$scope.errors = {};
				}

				function showErrors(key){
					return function(error){
						clearMessages();
						$scope.errors[key] = Array.isArray(error) ? error : [error];
					}
				}
			}]);
