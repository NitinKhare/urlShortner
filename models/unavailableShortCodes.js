let mongoose = require('mongoose');
 
let unAvailableShortCodesSchema = new mongoose.Schema({
    short_code: String,
    url: String,
    expiryDate: Date,
})

module.exports = mongoose.model("unAvailableShortCodes", unAvailableShortCodesSchema)