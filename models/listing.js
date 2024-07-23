const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : String,
    image : {
        filename: { type: String },
        url: { type: String }
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        refs: "User"
    }
});

const Listing = mongoose.model('Listing', listingSchema);

// Mongoose middleware to delete related reviews by deleting any listing.
listingSchema.post('findOneAndDelete', async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in : listing.reviews}})
    }
});

module.exports = Listing;