const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const flash = require('connect-flash');

const router = express.Router({mergeParams: true});

const Listing = require('../models/listing.js'); // require Listing Model
const ExpressError = require('../utils/ExpressError.js'); // require ExpressError Class

// index route
router.get('/',asyncHandler(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// new route
router.get('/new', (req, res) => {
    res.render("listings/new.ejs");
});

// create route
router.post('/', asyncHandler(async (req, res) => {
    // Here listing is an array with [title, price, description, image.url, country, location] fields in new.ejs file
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

// show route
router.get('/:id',asyncHandler(async (req, res, next) => {
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
router.get('/:id/edit',asyncHandler(async (req, res) => {
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
router.put('/:id',asyncHandler(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data please");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports = router;