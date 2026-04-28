const express = require('express');
const cors = require('cors');
const path = require('path');
const rc4Routes = require('./routes/rc4Routes');

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // Log body for POST requests (avoid logging large bodies or secrets in prod)
    if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
        console.log(`[${timestamp}] Body:`, JSON.stringify(req.body, null, 2));
    }
    
    next();
});


// Mount /api endpoints
app.use('/api', rc4Routes); 

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback to React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`RC4 Full Stack Server running on port ${PORT}`);
});
