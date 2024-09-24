const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

//gives the server access to all of our files
app.use(express.static('./'));

//serves the Dashboard.html file to the browser
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Pages/Dashboard.html'));
});

//hosts the server on localhost:3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;