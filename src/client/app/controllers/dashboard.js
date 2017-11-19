angular.module('dashboard')
    .controller('dashboardController', 
        ['$scope', '$routeParams', '$location', 'authService', 'usersFactory',
            function($scope, $routeParams, $location, auth, factory){
                $scope.index = function(){
                    factory.index(setUsers);
                }

                $scope.delete = function(userId){
                    factory.delete(userId, setUsers);
                }

                function setUsers(currentUser, otherUsers){
                    $scope.currentUser = currentUser;
                    $scope.otherUsers = otherUsers;
                }
            }
        ]
    );
