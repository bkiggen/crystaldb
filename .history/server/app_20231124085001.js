const express = require("express");
const app = express();
const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

app.get("/", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results.rows);
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
