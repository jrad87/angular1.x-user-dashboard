module.exports = function(request, response, next){
    if(request.user && request.user.isAdmin){
        return next();
    }
    response.status(403).json("Only admins may perform this action");
}
