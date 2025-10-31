require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = process.env.DB_SOURCE;

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Terhubung ke basis data')
        db.run(`CREATE TABLE IF NOT EXISTS movies(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            director TEXT NOT NULL,
            year INTEGER NOT NULL
        )`, (err) => {
            if (err) { /* tabel sudah ada */} else {
                //tambahkan data awal jika tabel baru dibuat
                const insert = `INSERT INTO movies (title, director, year) VALUES (?,?,?)`;
                //db.run(insert, ["Parasite", "Bong Joon-ho", 2019]);
                //db.run(insert, ["The Dark Knight", "Christopher Nolan", 2019]);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS directors(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birthYear INTEGER NOT NULL
        )`, (err) => {
            if (err) {/*tabel sudah ada*/} else {
                const insert = `INSERT INTO directors (name, birthYear) VALUES (?,?)`;
                //db.run(insert, ["Bong Joon-ho", 1969]);
                //db.run(insert, ["Christopher Nolan", 1970]);
            }
        });
    }
});

module.exports = db;