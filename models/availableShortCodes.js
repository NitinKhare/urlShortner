let mongoose = require('mongoose');
 
let AvailableShortCodesSchema = new mongoose.Schema({
    short_code: String,
    expiryDate: Date,
})

module.exports = mongoose.model("AvailableShortCodes", AvailableShortCodesSchema)