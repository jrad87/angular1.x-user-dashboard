const User = require('mongoose').model('User');
const Timeouts = require('mongoose').model('Timeouts');
const errorHandler = require('../utils/error-handler');

module.exports = {
    login(request, response){
        User.findOne({username: request.body.username})
            .then(user => {
                if(!user) throw new Error('Invalid credentials');
                return User.verifyPassword(request.body.password, user)
            })
			.then(user => {
				if (user.isActive) { throw new Error(`
					Already logged in, please sign out of your other devices
				`)}
				user.isActive = true;
				return user.save();
			})
			.then(user => {
				login(request, response, user);
			})
            .catch(errorHandler.bind(response));
    },
    register(request, response){
        if (request.body.password !== request.body.confirmPW){
            errorHandler.call(response, new Error('Password must match confirmation'));
        } else {
			User.findOne({username: request.body.username})
				.then(user => {
					if (user) throw new Error('User already exists, please login or select different username');
					return User.create(request.body)
						.then(newUser => login(request, response, newUser));
				})
				.catch(errorHandler.bind(response));
		}
    },
    logout(request, response){
		User.findById(request.session.user._id)
			.then(user => {
				user.isActive = false;
				return user.save();
			})
			.then(user => {
				request.session.destroy();
				response.clearCookie('userID');
				response.clearCookie('expiration');
				return Timeouts.Queue()
					.then(queue => {
						return queue.removeUser(user);
					});
			})
			.then(queue => response.json(true))
			.catch(console.log);
    },
	logoutAll(request, response){
		User.find({})
			.then(users => {
				return Promise.all(users.map(user => {
					user.isActive = false;
					return user.save();
				}))
			})
			.then(() => Timeouts.Queue())
			.then(queue => queue.clearAll())
			.then(() => {
				request.session.destroy();
				response.clearCookie('userID');
				response.clearCookie('expiration');
				response.json(true);
			})
			.catch(console.log)
	}
}

function login(request, response, user){
	return Timeouts.Queue()
		.then(queue => {	
			return queue.enqueue(user._id);
		})
		.then(queue => {
			request.session.user = user.toObject();
			delete request.session.user.password;
			response.cookie('userID', user._id.toString());
			response.cookie('expiration', Date.now() + 86400 * 1000);
			response.json(request.session.user);
		});
}
