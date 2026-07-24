const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "users.db"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

const count = db.prepare("SELECT COUNT(*) AS total FROM users").get();

if (count.total === 0) {
  const insert = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");

  const seed = db.transaction(() => {
    insert.run("kamal", "password123");
    insert.run("naveen", "mypassword");
  });

  seed();
  console.log("Database seeded with 2 users.");
}

module.exports = db;
