const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const asyncHandler = require('express-async-handler');

const Listing = require('./models/listing.js'); // require Listing Model
const Review = require('./models/review.js'); // require Review Model
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

main().catch(err => console.log(err));

async function main() {
    console.log("Connected");
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// index route
app.get('/listings', asyncHandler(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// new route
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});

// create route
app.post('/listings', asyncHandler(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show route
app.get('/listings/:id', asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    const oneListing = await Listing.findById(id).populate("reviews");
    if (!oneListing) {
        throw new ExpressError(404, "Id not found");
    }
    res.render("listings/show.ejs", { oneListing });
}));

// edit route
app.get('/listings/:id/edit', asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    const oneListing = await Listing.findById(id);
    if (!oneListing) {
        throw new ExpressError(404, "Id not found");
    }
    res.render("listings/edit.ejs", { oneListing });
}));

// update route
app.put('/listings/:id', asyncHandler(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data please");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route 
app.delete('/listings/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Reviews Route
app.post('/listings/:id/reviews', asyncHandler(async(req, res) => {
    let {id} = req.params;

    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review saved");
    res.redirect(`/listings/${listing._id}`);
}));

// Review Delete Route
app.delete('/listings/:id/reviews/:reviewId', asyncHandler(async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

// if client enter some other route.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// App Listening
app.listen(port, () => {
    console.log(`App Listening at ${port}`);
});