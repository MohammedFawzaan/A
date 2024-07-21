const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router({mergeParams: true});

const Listing = require('../models/listing.js'); // require Listing Model
const Review = require('../models/review.js'); // require Review Model

// Reviews Route
router.post('/', asyncHandler(async(req, res) => {
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
router.delete('/:reviewId', asyncHandler(async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;