const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
    user: {
	type: Schema.Types.ObjectId,
	ref: 'User'
    },
    text: {
	type: String,
	required: true
    },
}, {
    timestamps: true
});

chatMessageSchema.index({'createdAt': true});

chatMessageSchema.statics.getPartialHistory = function(){
    return this.find({})
	.populate({
	    path: 'user',
	    select: 'username'
	})
	.sort('createdAt')
	.limit(10)
	.exec()
	.then(messages => {
	    return messages.map(message => {
		if (message.user){
		    return `${message.user.username}: ${message.text}`;
		}
		return `${message.text}`;
	    })
	});
};

chatMessageSchema.statics.clearHistory = function(){
    return this.remove({});
}

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
