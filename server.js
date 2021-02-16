const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Apply middleware

app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

// Set templating engine to EJS

app.set('view engine', 'ejs');

// Define routes

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

// Start server

app.listen(port, () => 
    console.log(`App listening on port ${port}.`),
);