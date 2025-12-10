const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "budget.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            amount REAL,
            type TEXT
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO transactions (description, amount, type) VALUES (?,?,?)'
                db.run(insert, ["Salary",5000,"income"])
                db.run(insert, ["Rent",1500,"expense"])
            }
        });
    }
});

module.exports = db
