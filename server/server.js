// Base declarations
const http = require('http');
const express = require('express');

// Create a path to serve from
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);

// Console log for when the server crashes
server.on('error', function(err){
    console.error('Server Error: ', err);
});

// Declare a port for heroku or default to 2000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`ConSynth start on :${PORT}`);
});