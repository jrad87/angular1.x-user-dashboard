const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name must be at least 2 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [8, 'Username must be at least 8 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
	type: Boolean,
	default: true,
    },
    description: {
        modified: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
			required: [true, 'Description text is required'],
            default: "Write something about yourself!"
        }
    },
    messagesTo: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    directMessagesTo: [{
	type: Schema.Types.ObjectId,
	ref: 'DirectMessage'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    bcrypt.genSalt(10, (error, salt) => {
        if(error) return next(error);
        bcrypt.hash(this.password, salt, (error, hashedPW) =>{
            if(error) return next(error);
            this.password = hashedPW;
            return next();
        });
    });
});

userSchema.statics.verifyPassword = function(candidatePW, user){
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePW, user.password, (error, success) => {
            if (error) reject(error);
            success ? resolve(user) : reject(new Error('Invalid credentials'));
        });
    });
}
module.exports = mongoose.model('User', userSchema);
