const mongoose = require('mongoose');
const { data } = require('./data.js');
const Listing = require('../models/listing.js');

main().catch(err => console.log(err));

async function main() {
    console.log("Connected");
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    // adding Owner to each object.
    const modifiedData = data.map((obj) => ({ ...obj, owner: "669fb0266404c4d0f35472f2" }));
    await Listing.insertMany(modifiedData);
    console.log("Data initialized ");
}

initDB();