const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejs = require('ejs');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({extended: true}));
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
app.get('/listings', async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// new route
app.get('/listings/new', async (req, res) => {
    res.render("listings/new.ejs");
});

// create route
app.post('/listings', async (req, res )=>{
    const listing  = req.body.listing;
    const newListing = new Listing(listing);
    console.log(listing);
    await newListing.save();
    res.redirect("/listings");
});

// show route
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const oneListing = await Listing.findById(id);
    res.render("listings/show.ejs", { oneListing });
});

// edit route
app.get('/listings/:id/edit', async (req, res) => {
    const {id} = req.params;
    const oneListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {oneListing});
});

// update route
app.put('/listings/:id', async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// delete route 
app.delete('/listings/:id', async (req, res)=>{
    const {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings');
});

app.listen(port, () => {
    console.log(`App at ${port}`);
});