const express = require('express');
const {PORT} = require('./config');

const loaders = require('./loaders');

const app = express();

loaders(app);

app.listen(PORT, () => {
    console.log(`Connect server on port ${PORT}`);
});