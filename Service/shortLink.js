// /shorten - create, validate ->{short code in use, validity of url}
const axios = require('axios');
const utils = require('../utility/utils')
const encodedUrl = require('../models/encodedUrl');
const unAvailableShortCodes = require('../models/unavailableShortCodes');
const availableShortCode = require('../models/availableShortCodes');
const unavailableShortCodes = require('../models/unavailableShortCodes');
const rQuery = require('../utility/redis');

let updateShortCodeStats = async(shortCode) =>{
    try{
        //increment redirectCount by 1
        //updatelastSeenDate to current
        await  encodedUrl.updateOne({short_code: shortCode}, {
            last_seen_date: new Date().toISOString(),
            $inc:{redirect_count:1}
        })

    }catch(e){
        console.error('error updating stats for shortCode ', shortCode)
    }
}

module.exports.getUnUsedShortCodes = async () => {
    let available = await rQuery.getAvailableShortCode()
    if(available) return available;
    let unusedShortCode = await availableShortCode.findOne();
    if(!unusedShortCode?.short_code){
        while(true){  // should be done by a different service to keep generating unused shortcode
            let randomString = utils.generaateRandomString();
            let shortCode = utils.urlToHash(randomString);
            console.log("generated short code");
            let isShortCodeAvailable = await this.checkShortCodeAvailability(shortCode)
            if(!isShortCodeAvailable) continue;
            await availableShortCode.create({short_code: shortCode});
            return shortCode;
        }
    }else{
        return unusedShortCode.short_code
    }
}

module.exports.checkShortCodeAvailability = async (shortCode) =>{
    //TODO
    //first check from cache
    let available = await rQuery.getAvailableShortCode()
    if(available) return true;
    //then from db
    available = await unAvailableShortCodes.findOne({short_code: shortCode});
    if(available) return false;
    return true
}

module.exports.create = async (body) => {
    try {
        if(!body.shortcode){
            body.shortcode = await this.getUnUsedShortCodes(body.url);
        }else{
            let isShortCodeAvailable = this.checkShortCodeAvailability(body.shortcode)
            if(!isShortCodeAvailable) throw new Error("ShortCode taken")
        }
        let data = {
            short_code: body.shortcode,
            url: body.url,
        }
        let shortCodeAlreadyExists = await unavailableShortCodes.findOne({url:body.url});
        if(shortCodeAlreadyExists){
            throw new Error("url already encoded");
        }
        let createdEncodedCode = await encodedUrl.create(data)
        //mark the shortcode as used, delete from available short codes put it into redis
        await unAvailableShortCodes.create({
            short_code: data.short_code,
            url: body.url
        })
        await availableShortCode.deleteOne({short_code: data.short_code})


        return {error: false, statusCode: 200, data: createdEncodedCode}
    } catch (e) {
        return {error: true, statusCode: 406, message: e.message}
    }
}

module.exports.redirect = async (shortCode) =>{
    try{
        const getShortCode = await utils.getShortCodeData(shortCode)
        console.log("getShort Code data ", getShortCode )
        if(!getShortCode || getShortCode.error || !getShortCode?.shortCode?.short_code){
            throw new Error("shortCode Data incorrect")
        }
        updateShortCodeStats(getShortCode.shortCode.short_code); //updates short code stats
        return getShortCode;
    }catch(e){
        return {error: true, statusCode: 404, message: e.message}
    }
}


module.exports.getStats = async (shortCode) =>{
    try{
        const getShortCode = await encodedUrl.findOne({short_code: shortCode})
        if(!getShortCode || getShortCode.error){
            throw new Error("shortCode Data incorrect")
        }
        return {error: false, data:getShortCode};
    }catch(e){
        return {error: true, statusCode: 404, message: e.message}
    }
}

