module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // user related info stored in isAuthenticated().
    if(!req.isAuthenticated()) {
        req.flash("error", "you must logged in to create a listing");
        return res.redirect('/login');
    }
    next();
};