angular.module('dashboard')
    .service('authService', ['$http', '$cookies', 
        function($http, $cookies){
            this.isAuthed = function(){
                var session = $cookies.get('currentUser');
                var userID = $cookies.get('userID');
                var expiration = $cookies.get('expiration');
                return session && userID && expiration && (expiration > Date.now());
            };

            this.userID = function(){
                return $cookies.get('userID');
            };

            this.logout = function(){
                return $http.delete('/api/auth/logout');
            }

			this.logoutAll = function(){
				return $http.delete('/api/auth/logout-all');
			}
        }
    ]
);
