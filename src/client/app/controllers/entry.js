angular.module('dashboard')
    .controller('entryController',
        ['$scope', '$location', 'authService', 'userService',
            function($scope, $location, auth, user){
                if(auth.isAuthed()) $location.path('/dashboard');
                $scope.user = {};
                $scope.login = function(){
                    user.login($scope.user)
                        .then( () => $location.path('/dashboard'))
                        .catch(errorResponse => {
                            showErrors(errorResponse.data);
                        });
                };
                $scope.register = function(){
                    user.register($scope.user)
                        .then( () => $location.path('/dashboard'))
                        .catch(errorResponse => {
                            showErrors(errorResponse.data);
                        });
                }
                function showErrors(errors){
                    $scope.errors = Array.isArray(errors) ? errors : [errors];
                }
            }
        ]
    );
