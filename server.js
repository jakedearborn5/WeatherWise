const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const chatBotRoute = require('./routes/chatBotRoute');

//gives the server access to all of our files
app.use(express.static('./'));
app.use(chatBotRoute);

// Middleware to validate the path
const validatePath = (req, res, next) => {
    console.log("Testing path...");
    // Define valid paths (you can modify this as needed)
    const validPaths = ['/'];
    
    // Check if the requested path is valid
    if (validPaths.includes(req.path)) {
        console.log("OK");
        next(); // Valid path, proceed to the next middleware
    } else {
        console.log("Not OK");
        res.send(`
        <html>
            <head>
                <h1>Page Not Found</h1>
                <script>
                    let countdown = 2; // Countdown from 2 seconds
                    function updateCountdown() {
                        document.getElementById('countdown').innerText = countdown;
                        countdown--;
                        if (countdown < 0) {
                            window.location.href = '/'; // Redirect after countdown
                        }
                    }
                    setInterval(updateCountdown, 1000); // Update every second
                </script>
            </head>
            <body>
                <h2>Redirecting you to the dashboard in <span id="countdown">2</span> seconds...</h2>
            </body>
        </html>
    `);
    }
};

// Use the validation middleware
app.use(validatePath);

// Serves the Dashboard.html file to the browser
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Pages/Dashboard.html'));
});

//hosts the server on localhost:3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;