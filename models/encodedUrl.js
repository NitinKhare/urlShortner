let mongoose = require('mongoose');
 
let encodedUrlSchema = new mongoose.Schema({
    short_code: String,
    url: String,
    start_date: {type: Date, default: Date.now},
    redirect_count: {type: Number, default: 0},
    last_seen_date: Date,
})

module.exports = mongoose.model("encodedUrl", encodedUrlSchema)