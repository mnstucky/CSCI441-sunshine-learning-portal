// Load basic routing services
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Load local environmental variables
require('dotenv').config();

// Load services for user authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

// Load database services
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Apply middleware

app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

// Set templating engine to EJS

app.set('view engine', 'ejs');

// Define routes

app.get("/db/", (req, res) => {
    pool.query('SELECT * FROM logins', (err, data) => {
        console.log(err);
        console.log(data);
        res.send(JSON.stringify(data.rows));
        pool.end();
    })
})

app.get("/", (req, res) => {
    res.render(`${__dirname}/views/index`);
})

app.get("/contact/", (req, res) => {
    res.render(`${__dirname}/views/contact`);
})

app.get("/discussions/", (req, res) => {
    res.render(`${__dirname}/views/discussions`);
})

app.get("/leaders/", (req, res) => {
    res.render(`${__dirname}/views/leaders`);
})

app.get("/learning/", (req, res) => {
    res.render(`${__dirname}/views/learning`);
})

app.get("/profile/", (req, res) => {
    res.render(`${__dirname}/views/profile`);
})

app.get("/login/", (req, res) => {
	res.render(`${__dirname}/views/login`);
})

// Start server

app.listen(port, () => 
    console.log(`App listening on port ${port}.`),
);