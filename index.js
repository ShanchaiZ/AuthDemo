// Installed Dependencies:
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const session = require("express-session");
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

app.use(session({ secret: "notagoodsecret" }));

//middleware to verifry login 
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect("/login");
    }
    next();
}


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
    req.session.user_id = user._id; // if u successfully register/log in - we store ur user id in session.
    res.redirect("/");
});


//Get Route: User Login form
app.get('/login', (req, res) => {
    res.render("login");
})


//Post Route: User Login form action:
app.post('/login', async (req, res) => {
    const { password, username } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id; // if u successfully register/log in - we store ur user id in session.
        res.redirect("/secret")
    } else {
        res.redirect("/login");
    }
})


//POST ROUTE: LOG OUT:
app.post("/logout", (req, res) => {
    req.session.user_id = null; //method one of logout: the session id to explicitly be null => this removes association
    // req.session.destroy(); //method two of logout: destroy the entire session if u storing a lot of stuff.
    res.redirect("/login");
})


app.get("/secret", requireLogin, (req, res) => {
    res.render("secret");
});

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
// we want to associate a given user's browers with some pieece of data when they log in.
// npm require express session + its app.use middleware

// reminder: when u successfully log in, we going to add something to session. session store will associate some data with a particular cookie. You automatically receive a cookie once u start using the middleware.
// then we save the user id after the authentication is successful < req.session.user_id = user._id; > because we often need to use the user ID to find the user so we can allow stuff.

//----------------------------------------

// D. LOG out:

// all we need to do to log someone out is to remove the user_id from the session.
//create a log out form that form actions to /logout

//ONE WAY TO LOGOUT: add a app.post route on that removes the session id to null.
//ANOTHER WAY: destroy the session => if u storing more stuff dont want to trace anything.

//----------------------------------------

// E. Require log in middleware: to protect multiple endpoints.

// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect("/login");
//     }
//     next();
// }


//----------------------------------------

// F. optional here: Refactor some of the code out of route handlers!
//tips: add some logic onto the model to reduce code in main route index.