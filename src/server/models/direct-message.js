const mongoose = require('mongoose');
const { Schema } = mongoose;

const directMessageSchema = new Schema({
	messageFrom: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	messageTo: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('DirectMessage', directMessageSchema);
