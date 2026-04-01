const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON data

const bookRouter = require('./route/bookRoute');
app.use('/books', bookRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
