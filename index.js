const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
var multipart = require('connect-multiparty');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(session({
    secret: 'WABARRABA2563!',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: './sessions',
        ttl: 24 * 60 * 60,
        retries: 0
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/' 
    }
}));


var multipartMiddleware = multipart({uploadDir: path.join(__dirname, 'excel')});
app.use(multipartMiddleware);
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Set up routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});