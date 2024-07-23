const Listing = require('./models/listing');
const Review = require('./models/review');

// middleware to check whether the user is Logged in or not
// [req.isAuthenticate()]

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // user related info stored in isAuthenticated().
    if(!req.isAuthenticated()) {
        req.flash("error", "you must logged in to create a listing");
        return res.redirect('/login');
    }
    next();
};

// middleware to check if there is a Owner of Listing.

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    let mylisting = await Listing.findById(id);
    if(!mylisting.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let myReview = await Review.findById(reviewId);
    if(!myReview.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you cannot delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}