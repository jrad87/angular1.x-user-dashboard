module.exports = function(request, response, next){
    if(request.user){
        return next();
    }
    response.status(403).json('You must be logged in');
}
