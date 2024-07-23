const { default: mongoose, Schema } = require("mongoose");

const reviewSchema = new  mongoose.Schema({
    comment : {
        type: String
    },
    rating : {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        refs: "User"
    }
});

module.exports = mongoose.model('Review', reviewSchema);