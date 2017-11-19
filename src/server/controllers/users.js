const User = require('mongoose').model('User');
const errorHandler = require('../utils/error-handler');

module.exports = {
    index(request, response){
        User.find({})
            .then(users => response.json(users))
            .catch(console.log);
    },
    show(request, response){
        User.findById(request.params.id)
            .then(user => response.json(user))
            .catch(console.log);
    },
    update(request, response){
		console.log(request.body);
		User.findById(request.params.id)
			.then(user => {
				if(!user) throw new Error('No user');
				if(request.body.password || request.body.confirmPW){
					if(!(request.body.password === request.body.confirmPW)){
						throw new Error('Passwords must match');
					}
				}
				user.set(request.body);
				
				//Chain promise off doc save method. Validation errors are caught
				//by the same handler catching the above errors.
				return user.save()
					.then( updatedUser => {
						response.json(updatedUser);
					});
			})
			.catch(errorHandler.bind(response));
    },
    receiveMessage(request, response){
        User.findById(request.params.id)
            .then(user => {
                user.messagesTo.unshift(request.body);
                user.save();
                response.json(request.user);
            })
            .catch(console.log);
    },
    deleteMessage(request,response){
        User.findById(request.params.u_id)
            .then(user => {
                user.messagesTo = user.messagesTo.filter(message => {
                    return message.toString() !== request.params.m_id;
                });
                user.save();
                response.json(true);
            })
            .catch(console.log);
    },
    delete(request, response){
        User.findByIdAndRemove(request.params.id)
            .then(user => response.json(user))
            .catch(console.log);
    }
}
