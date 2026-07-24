const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./Data/database");
const verifyToken = require("./middleware/auth");

const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// LOGIN
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    const user = db.prepare(
        "SELECT * FROM users WHERE username = ? AND password = ?"
    ).get(username, password);

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

// REGISTER
app.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    const existing = db.prepare(
        "SELECT * FROM users WHERE username = ?"
    ).get(username);

    if (existing) {
        return res.status(409).json({
            message: "Username already exists."
        });
    }

    const result = db.prepare(
        "INSERT INTO users (username, password) VALUES (?, ?)"
    ).run(username, password);

    const token = jwt.sign(
        {
            id: result.lastInsertRowid,
            username: username
        },
        "secretKey",
        {
            expiresIn: "1h"
        }
    );

    res.status(201).json({
        message: "User registered successfully",
        id: result.lastInsertRowid,
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
