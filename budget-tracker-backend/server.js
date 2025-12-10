const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
app.use(cors());
app.use(express.json());

const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

app.get("/api/transactions", (req, res, next) => {
    var sql = "select * from transactions"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/transactions/", (req, res, next) => {
    var errors=[]
    if (!req.body.description){
        errors.push("No description specified");
    }
    if (!req.body.amount){
        errors.push("No amount specified");
    }
    if (!req.body.type){
        errors.push("No type specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type
    }
    var sql ='INSERT INTO transactions (description, amount, type) VALUES (?,?,?)'
    var params =[data.description, data.amount, data.type]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

app.delete("/api/transactions/:id", (req, res, next) => {
    db.run(
        'DELETE FROM transactions WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

app.use(function(req, res){
    res.status(404);
});
