// Installed Dependencies:
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const ejs = require("ejs");


//Imported Models:
const User = require("./models/user");

//Imported mongoose db:
mongoose.connect('mongodb://127.0.0.1:27017/AuthDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


//Middleware:
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));// we need this to parse req.body




//Routes:
//=================================================================
//testing routes:

app.get("/", (req, res) => {
    res.send("Home page!")
})

app.get("/secret", (req, res) => {
    res.send("Secret route! cant be seen untill logged in!")
})

//Get route: create a new user
app.get("/register", (req, res) => {
    res.render("register");
})

//Post route: submit a user from form
app.post("/register", async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    await user.save();
    res.redirect("/");
});




// App is listening on Port:
//==================================================================
app.listen(3000, () => {
    console.log("App is listening on port 3000");
})


//=====================================================================
//Take user and password = create a new user!
//we will use "bcrypt" which will make us a new hashed password then it will be stored in our db.

//since we dont want to openly store passwords: we need to bcrypt the post route of password:
// 1. destructure the username and password = req.body
// 2. await bcrypt.hash(the password, saltrounds)
// 3. this will create a new user = who will have username: username, and password; hashed password
// 4. user.save();
// 5. redirect to login page


