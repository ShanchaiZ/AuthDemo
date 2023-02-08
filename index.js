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

//Get route: create a new user
app.get("/register", (req, res) => {
    res.render("register");
})

//Post route: submit a user from form
app.post("/register", async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username: username,
        password: hash
    });
    await user.save();
    res.redirect("/");
});


//Get Route: User Login form
app.get('/login', (req, res) => {
    res.render("login");
})


//Post Route: User Login form action:
app.post('/login', async (req, res) => {
    const { password, username } = req.body;
    const user = await User.findOne({ username: username }); //find user in our db

    //once we find the user, bcrypt compares user password with hashed password which returns a boolean result.
    const validPassword= await bcrypt.compare(password, user.password);
    if (validPassword) {
        res.send('WELCOME!!')
    } else {
        res.send("Incorrect username or password! try again!")
    }

})


app.get("/secret", (req, res) => {
    res.send("Secret route! cant be seen untill logged in!")
})

// App is listening on Port:
//==================================================================
app.listen(3000, () => {
    console.log("App is listening on port 3000");
})


//=====================================================================
// Objective: is to hide the /secret route and only select few can access that route:

//Take user and password = create a new user!
//we will use "bcrypt" which will make us a new hashed password then it will be stored in our db.


//A. REGISTERING A USER:
//since we dont want to openly store passwords: we need to bcrypt the post route of password:
// 1. destructure the username and password = req.body
// 2. await bcrypt.hash(the password, saltrounds)
// 3. this will create a new user = who will have username: username, and password; hashed password
// 4. user.save();
// 5. redirect to login page

//----------------------------------------

//B. AUTHENTICATION:
//login form:
//similar to register form but form action is different. then,
// create a post route: where we findone user with that username. once we find that user,
// we want to compare the hashed password to the password given by user.  as per docs: const validPassword= await bcrypt.compare(password, user.password);
//we write if statement about login sucess/failure result. 

//NOTE: if the password is incorrect or there is no username with that name we want to let the user know. BUT what we dont want the user to know is username is correct but password is wrong. we dont want ppl to guess with feedback!! best practise: "incorrect username or password"
// as of this point: we can register a user => we can log in as user BUT we cant remember user between request.


//----------------------------------------

// C. KEEPING A USER LOGGED IN (using cookies/session);