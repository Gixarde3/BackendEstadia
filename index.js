const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
var multipart = require('connect-multiparty');
const app = express();
// Set up middleware

var multipartMiddleware = multipart({uploadDir: path.join(__dirname, 'photos')});
app.use(multipartMiddleware);
app.use(express.json());

app.use(cors())

// Set up routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});