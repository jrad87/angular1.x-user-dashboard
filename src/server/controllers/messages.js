const Message = require('mongoose').model('Message');
const errorHandler = require('../utils/error-handler');

module.exports = {
    allMessages(request, respone){
        Message.find({})
			.sort('createdAt')
            .then(messages => response.json(messages))
            .catch(console.log);
    },
    showMessage(request, response){
        Message.showMessageById(request.params.id)
			.then(message => response.json(message))
            .catch(console.log);
    },
    postMessage(request, response){
        request.body.messageFrom = request.user._id;
        Message.create(request.body)
            .then(message => {
                return response.json(message);
            })
            .catch(errorHandler.bind(response));
    },
    updateMessage(request, response){
		Message.updateMessageText(request.params.id, request.body)
			.then(updatedMessage => response.json(updatedMessage))
			.catch(errorHandler.bind(response));
		/*
		Message.findByIdAndUpdate(
                request.params.id, 
                Object.assign(request.body, {edited: true}),
                {new: true, runValidators: true}
            )
            .populate({
				path: 'messageFrom',
				model: 'User'
			})
			.populate({
				path: 'comments',
				model: 'Comment',
				select: 'createdAt',
				populate: {
					path: 'commentBy',
					model: 'User'
				}
			})
            .then(message => response.json(message))
            .catch(errorHandler.bind(response));
		*/
	},
    deleteMessage(request, response){
        Message.findByIdAndRemove(request.params.id)
            .then(deletedMessage => {
				return Message.removeCommentsAfterDelete(deletedMessage);
			})
			.then(deletedMessage => response.json(deletedMessage))	
            .catch(console.log);
    },
}
