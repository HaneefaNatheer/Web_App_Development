const express = require('express');
const app = express();
const PORT = 3000;

// 1. MIDDLEWARE: This tells our server how to unpack JSON data sent in a POST request.
// (This is the Express HTTP Pipeline at work!)
app.use(express.json());

// 2. MOCK DATABASE: A simple array stored in the server's memory.
let books = [
    { id: 1, title: "Harry Potter" },
    { id: 2, title: "Lord of the Rings" }
];

// 3. GET ROUTE: Read the data node server.js.
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 4. POST ROUTE: Create new data
app.post('/api/books', (req, res) => {
    // req.body contains the unpacked JSON data sent by the user
    const newBook = req.body;

    // Add the new book to our array
    books.push(newBook);

    // Send a success message back to the client
    res.send("Book added successfully!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
