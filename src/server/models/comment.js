const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        minlength: [5, 'Comment must be at least 5 characters'],
		trim: true
    },
    commentOn: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    commentBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    edited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const commentOpts = [
	{
		path: 'messageFrom',
		model: 'User'
	}, {
		path: 'comments',
		model: 'Comment',
		populate: {
			path: 'commentBy',
			model: 'User',
			select: 'username'
		}
	}
]

commentSchema.statics.removeCommentFromMessage = function(comment){
	return this.model('Message').findById(comment.commentOn)
		.then(message => {
			message.comments.splice(message.comments.findIndex(objectID => {
				return objectID.toString() === comment._id.toString();
			}), 1);
			return message.save()
		})
		.then(message => this.model('Message').populate(message, commentOpts));	
}

commentSchema.methods.getParentMessage = function(){
	return this.model('Message').findById(this.commentOn)
		.then(message => message.populateMessage());
}

commentSchema.methods.postComment = function(messageID){
	console.log('comment methd def', this);
	return this.model('Message').findById(messageID)
		.then(message => {
			message.comments.push(this);
			return message.save();
		})
		.then(message => this.model('Message').populate(message, commentOpts));
}

module.exports = mongoose.model('Comment', commentSchema);

