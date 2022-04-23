const md5 = require("md5");
const axios = require("axios");
const unavailableShortCodes = require("../models/unavailableShortCodes");
const rQuery = require("./redis")
module.exports.urlToHash = (url) => {
    return md5(url).substr(0, 6);
}

module.exports.generaateRandomString = (length = 10) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports.getShortCodeData = async (shortCode) => {
    try {
        //TODO
        //check from cache first
        let shortCodeData = await rQuery.getShortCodeData(shortCode)
        if (shortCodeData) {
            shortCodeData = JSON.stringify(shortCodeData)
        } else {
            //then from db
            shortCodeData = await unavailableShortCodes.findOne({ short_code: shortCode });
        }
        if (!shortCodeData) {
            return { error: true, message: "Short code does not exists" }
        }
        return { error: false, shortCode: shortCodeData }
    } catch (e) {
        return { error: true, message: e.message }
    }
}

module.exports.checkValidUrl = async (url) => {
    try {
        let resp = await axios.get(url);
        return true;
    } catch (e) {
        console.log(url, e)
        return false;
    }
}