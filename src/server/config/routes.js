const auth = require('../controllers/auth');
const users = require('../controllers/users');
const messages = require('../controllers/messages');
const comments = require('../controllers/comments');

const loggedIn = require('../modules/is-logged-in');
const admin = require('../modules/is-admin');

module.exports = function(app){
    app
    .post('/api/auth/login', auth.login)
    .post('/api/auth/register', auth.register)
    .delete('/api/auth/logout', auth.logout)
	.delete('/api/auth/logout-all', auth.logoutAll)
    
	.get('/api/users', users.index)
    .get('/api/users/:id', users.show)
    .put('/api/users/messages/:id', users.receiveMessage)
    .put('/api/users/:id', users.update)
	.delete('/api/users/:u_id/messages/:m_id', users.deleteMessage)
    .delete('/api/users/:id', [admin], users.delete)
    
    .get('/api/messages', messages.allMessages)
    .post('/api/messages', messages.postMessage)
    .get('/api/messages/:id', messages.showMessage)
	.put('/api/messages/:id', messages.updateMessage)
	.delete('/api/messages/:id', messages.deleteMessage)
	
	.post('/api/comments/:message_id', comments.postComment)
	.delete('/api/comments/:id', comments.deleteComment)
	.put('/api/comments/:id', comments.updateComment)
}
