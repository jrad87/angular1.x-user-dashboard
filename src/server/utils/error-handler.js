module.exports = function(error){
    let errors = [];
    if(error.errors){
        errors = Object.keys(error.errors).map(key => error.errors[key].message);
    } else if ( typeof error === 'string' ){
        errors.push(error);
    } else {
        errors.push(error.message);
    }
    this.status(422).json(errors);
}
