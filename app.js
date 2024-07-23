const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const ejsMate = require('ejs-mate'); // ejs-mate
const path = require('path'); // path for using static middlewares
const methodOverride = require('method-override'); // for put and delete routes

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/ListingRoute.js');
const reviewRouter = require('./routes/ReviewsRoute.js');
const userRouter = require('./routes/UserRoute.js');

const ExpressError = require('./utils/ExpressError.js'); // require ExpressError Class

app.engine("ejs", ejsMate); // set ejsMate
app.set("view engine", "ejs"); // set views engine
app.set("views", path.join(__dirname, "views")); // views

// middlewares for static files etc
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/CSS")));
app.use(express.static(path.join(__dirname, "/public/JS")));
app.use(cookieParser("secretcode"));

app.use(cookieParser());

// mongoose connection.
main().catch(err => console.log(err));
async function main() {
    console.log("Connected");
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions = session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

// Authentication Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // current user session, because we are using req.user in ejs templates and for Authorization.
    res.locals.currUser = req.user;
    next();
});

// middleware for routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// if client enter some other route. UI shows Page not found.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", { message });
    next();
});

// App Listening
app.listen(port, () => {
    console.log(`App Listening at ${port}`);
});