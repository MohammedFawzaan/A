const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// sign up get route
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

// to signup user [model.register(newUser, password)]
router.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // to automatically login after sign up
        // [req.login()]
        req.login(registeredUser, (err)=> {
            if(err) return next(err);
            req.flash("success", "Welcom To WanderLust");
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
});

// login get route
router.get('/login', (req, res) => {
    res.render("users/login.ejs");
});

// to login a user [passport.authenticate()]
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcom To WanderLust");
        res.redirect('/listings');
    }
);

// to logout a user [req.logout()]
router.get('/logout', (req, res) => {
    req.logOut((err)=> {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are Logged out");
        res.redirect('/listings');
    });
});

module.exports = router;