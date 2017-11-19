const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    text: {
        type: String,
        required: [true, 'A message body is required'],
        minlength: [5, 'Message must be at least 5 characters']
    },
    messageTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messageFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    edited: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})

const messageOpts = [
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
	}];

messageSchema.methods.populateMessage = function(){
	return this.model('Message').populate(this, messageOpts);
}

messageSchema.statics.showMessageById = function(id){
	return this.model('Message').findById(id)
		.then(message => message.populateMessage());
}

messageSchema.statics.updateMessageText = function(id, newText){
	return this.model('Message')
		.findByIdAndUpdate(
			id, 
			Object.assign(newText, {edited: true}),
			{new: true, runValidators: true})
		.then(message => message.populateMessage());
}

messageSchema.statics.removeCommentsAfterDelete = function(deletedMessage){
	return Promise.all(deletedMessage.comments.map(commentId => {
			return this.model('Comment').findByIdAndRemove(commentId);
		}))
		.then( () => deletedMessage);
}

module.exports = mongoose.model('Message', messageSchema);
