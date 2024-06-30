const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejs = require('ejs');

main().catch(err => console.log(err));

async function main() {
    console.log("Connected");
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`App at ${port}`);
});