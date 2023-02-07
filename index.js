// Installed Dependencies:
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const ejs = require("ejs");


//Imported Models:
const User = require("./models/user");



//Routes:
//=================================================================
//testing routes:
app.get("/secret", (req, res) => {
    res.send("Secret route! cant be seen untill logged in!")
})


// App is listening on Port:
//==================================================================
app.listen(3000, () => {
    console.log("App is listening on port 3000");
})