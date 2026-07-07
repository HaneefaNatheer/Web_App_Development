const express = require('express');
const mockData = require('./data.js');
const app = express();
const PORT = 3000;

app.get('/', (request, response) => {
    response.send(`Hello ! My Node.js server is running`);
});

app.get('/api/users', (request, response) => {
    response.json(mockData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});