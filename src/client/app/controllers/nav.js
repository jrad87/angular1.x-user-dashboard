angular.module('dashboard')
    .controller('navController',
        ['$scope', '$location', 'authService', 'socketFactory',
            function($scope, $location, auth, sockets){
                var isAuthed = auth.isAuthed();
                $scope.initInternal = function(){
                    if(!isAuthed) {
						$location.path('/')
					} 
                }
                $scope.initEntry = function(){
                    if(isAuthed) $location.path('/dashboard');
                }
                $scope.userID = auth.userID();
                $scope.logout = function(){
                    auth.logout()
                        .then(function(){
                            $location.path('/');
                        })
                        .catch(console.log);
                };
				$scope.logoutAll = function(){
					auth.logoutAll()
						.then(function(){
							$location.path('/');
						})
						.catch(console.log);
				}

            }
        ]
    );
