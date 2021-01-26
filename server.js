const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to the future Sunshine Learning Portal.");
})

app.listen(port, () => 
    console.log(`App listening on port ${port}.`),
);