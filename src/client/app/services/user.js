angular.module('dashboard')
    .service('userService', 
        ['$http', function($http){
            this.login = function(user){
                return $http.post('/api/auth/login', user);
            };

            this.register = function(user){
                return $http.post('/api/auth/register', user);
            };
        }
    ]
);
