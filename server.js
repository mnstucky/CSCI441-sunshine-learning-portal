const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
})

app.get("/contact/", (req, res) => {
    res.sendFile(`${__dirname}/views/contact.html`);
})

app.get("/discussions/", (req, res) => {
    res.sendFile(`${__dirname}/views/discussions.html`);
})

app.get("/leaders/", (req, res) => {
    res.sendFile(`${__dirname}/views/leaders.html`);
})

app.get("/learning/", (req, res) => {
    res.sendFile(`${__dirname}/views/learning.html`);
})

app.get("/profile/", (req, res) => {
    res.sendFile(`${__dirname}/views/profile.html`);
})

app.listen(port, () => 
    console.log(`App listening on port ${port}.`),
);