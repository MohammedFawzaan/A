const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : String,
    image : {
        // type: String,
        // default: "https://tse3.mm.bing.net/th?id=OIP.Vt3kGu4X6WQlmH91GpJpzgHaFH&pid=Api&P=0&h=180",
        // set: (v) => v==="" ? "https://tse3.mm.bing.net/th?id=OIP.Vt3kGu4X6WQlmH91GpJpzgHaFH&pid=Api&P=0&h=180" : v
        filename: { type: String },
        url: { type: String }
    },
    price : Number,
    location : String,
    country : String
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;