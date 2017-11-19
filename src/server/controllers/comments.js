const Comment = require('mongoose').model('Comment');
const errorHandler = require('../utils/error-handler');

module.exports = {
    postComment(request, response){    
		request.body.commentBy = request.user._id;
        request.body.commentOn = request.params.message_id;
		Comment.create(request.body)
			.then(comment => {
				return comment.postComment(request.params.message_id)
			})
			.then(message => {
				response.json(message)
			})
			.catch(errorHandler.bind(response))
    },
	deleteComment(request, response){
		Comment.findByIdAndRemove(request.params.id)
			.then(deletedComment => Comment.removeCommentFromMessage(deletedComment))
			.then(updatedMessage => response.json(updatedMessage))
			.catch(console.log);
	},
	updateComment(request, response){
		Comment.findByIdAndUpdate(request.params.id, request.body, {runValidators: true})
			.then(updatedComment => updatedComment.getParentMessage())
			.then(updatedMessage => response.json(updatedMessage))
			.catch(errorHandler.bind(response));
	}
}
