const Timeouts = require('mongoose').model('Timeouts')

const timeoutInterval = 60 * 1000;

module.exports = function(request, response, next){
	Timeouts.Queue()
		.then(queue => {
			let queuedTimeout = queue.peek();
			if( Date.now() > (Date.parse(queuedTimeout.timestamp) + timeoutInterval)){
				console.log('Performing action, but be warned user has timed out');
			}
			next()
		})
		.catch(next);
}
