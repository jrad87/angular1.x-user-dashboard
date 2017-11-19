angular.module('dashboard')
    .factory('usersFactory', 
        ['$q', '$http',  'authService', function($q, $http, auth){
            var _users = [];
            function responseData(response){
                return response.data;
            }
            function currentUser(id, users){
                return users.find(function(user){
                    return user._id === id; 
                });
            }
            function otherUsers(id, users){
                return users.filter(function(user){
                    return user._id !== id;
                });
            }
            function partitionUsers(id, users){
                return [currentUser(id, users), otherUsers(id, users)];
            }
            return {
                index(setUsers){
                    $http.get('/api/users')
                        .then(responseData)
                        .then(function(users){
                            _users = users;
                            var userID = auth.userID();
                            setUsers(...partitionUsers(userID, _users));
                        })
                        .catch(console.log);
                },
                delete(userID, setUsers){
                    $http.delete('/api/users/' + userID)
                        .then(function(){
                            var _user = _users.find(function(user){
                                return user._id === userID;
                            });
                            _users.splice(_users.indexOf(_user), 1);
                            setUsers(...partitionUsers(auth.userID(), _users));
                        })
                        .catch(console.log);
                },
                show(userID, viewUser){
                    var _user = _users.find(function(user){
                        return user._id === userID;
                    });
                    if (_user){
                        viewUser(_user);
                    } else {
                        $http.get('/api/users/' + userID)
                            .then(responseData)
                            .then(function(_user){
                                viewUser(_user);
                            })
                            .catch(console.log);
                    }
                },
				update(userID, data, setUser, showErrors, showMessages){
					$http.put('/api/users/' + userID, data)
						.then(responseData)
						.then(function(updatedUser){
							setUser(updatedUser);
							showMessages();
						})
						.catch(function(errorResponse){
							showErrors(errorResponse.data);
						});
				}
            };
        }])
