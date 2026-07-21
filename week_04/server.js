const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data/users");
const verifyToken = require("./middleware/auth");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

// LOGIN
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Body Guard
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        "secretKey",
        {
            expiresIn: "1h"
        }
    );

    res.json({
        message: "Login Successful",
        token: token
    });

});

// Protected Route
app.get("/dashboard", verifyToken, (req, res) => {

    res.json({
        message: "Welcome to Dashboard",
        loggedInUser: req.user
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});