const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sessionConfig = {
    saveUninitialized: true,
    resave: false,
    rolling: true,
    name: 'currentUser',
    secret: 'klkmklkmklkm',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 86400 * 1000
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session(sessionConfig));
app.use(cookieParser('kjkjnhjgvgtwqwewdfds'));

//app.use(express.static(path.resolve('bower_components')));
app.use(express.static(path.resolve('src', 'client', 'public')));

require(path.resolve('src', 'server', 'config', 'database'));
app.use(require(path.resolve('src', 'server', 'modules', 'populate-user')));

/*
app.use(['/api/messages', '/api/comments', '/api/users'], 
	require(path.resolve('server', 'modules', 'track-timeouts'))
);
*/

require(path.resolve('src', 'server', 'config', 'routes'))(app);
require(path.resolve('src', 'server', 'config', 'socket'))(io);

http.listen(port, () => console.log(`Listening on port ${port}`));
