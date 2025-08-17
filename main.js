const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from templates directory
app.use(express.static(path.join(__dirname, 'templates')));

let thread = null;

function backgroundThread() {
    console.log("Generating random sensor values");
    
    let st1 = 0;
    let st2 = 0;
    
    const interval = setInterval(() => {
        const s1 = 0;
        const s2 = 1;
        
        if (s1 !== st1) {
            st1 = s1;
            io.emit('message', { id: 1, status: s1 });
        }
        
        if (s2 !== st2) {
            st2 = s2;
            io.emit('message', { id: 2, status: s2 });
        }
    }, 1000);
    
    return interval;
}

// When a Client Connected
io.on('connection', (socket) => {
    console.log('A client connected');
    socket.emit('message', 'Send From Server');
    
    // When a Client Disconnected
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
    
    // Messaging
    socket.on('message', (message) => {
        console.log('Received message: ' + message);
        io.emit('message', message); // broadcast to all clients
    });
});

function sendMessage(message) {
    io.emit('message', message);
}

// Default Index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
