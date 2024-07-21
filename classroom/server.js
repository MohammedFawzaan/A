const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.set("view engine", "ejs"); // set views engine
app.set("views", path.join(__dirname, "views")); // views

// mongoose connection.
main().catch(err => console.log(err));
async function main() {
    console.log("Connected");
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions = session({
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true
});

app.use(cookieParser());
app.use(sessionOptions);
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.successMsg = req.flash("error");
    next();
});

app.get('/register', (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registerd successfully");
    }
    // console.log(req.session.name);
    // console.log(req.session);
    res.redirect('/hello');
});

app.get('/hello', (req, res) => {
    // res.send(`hello ${req.session.name}`);
    // console.log(req.flash("success"));
    // res.locals.errorMsg = req.flash("error");
    // res.locals.successMsg = req.flash("success");
    res.render("page.ejs", {name: req.session.name});
});

app.get('/cookie', (req, res)=>{
    res.cookie("Greet", "Hello", {signed: true});
    res.send("Cookie");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("Verified");
});

// App Listening
app.listen(port, () => {
    console.log(`App Listening at ${port}`);
});