const User = require('mongoose').model('User');

module.exports = function(request, response, next){
    if(request.session && request.session.user){
        User.findById(request.session.user._id)
            .then(user => {
                request.user = user;
                next();
            })
            .catch(next)
    } else {
        next();
    }
}
