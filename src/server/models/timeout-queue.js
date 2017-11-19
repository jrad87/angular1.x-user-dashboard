const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeoutQueueSchema = new Schema({
	queue: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		timestamp: {
			type: Date,
		}
	}]
}, {
	timestamps: true
});

timeoutQueueSchema.statics.Queue = function(){
	 return this.findOne({})
		.then(queue => {
			if(!queue) return this.create({});
			return queue;
		});
}

timeoutQueueSchema.methods.enqueue = function(user){
	this.queue.push({
		user: user,
		timestamp: new Date()
	});
	return this.save();
}

timeoutQueueSchema.methods.clearAll = function(){
	this.queue = [];
	return this.save();
}

timeoutQueueSchema.methods.removeUser = function(user){
	this.queue = this.queue.filter(entry => {
		return entry.user.toString() !== user._id.toString();
	}); 
	return this.save();
}

timeoutQueueSchema.methods.clear = function(user){
	this.queue = [];
	return this.save();
}

timeoutQueueSchema.methods.peek = function(){
	return this.queue[0];
}
module.exports = mongoose.model('Timeouts', timeoutQueueSchema);
