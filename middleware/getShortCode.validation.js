const Joi = require('joi');
const utils = require('../utility/utils');

module.exports.createShortCodeValidation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            shortcode: Joi.string().regex(new RegExp("[0-9a-zA-Z_]{6}")),
            url: Joi.string().uri().required(),
        })
        let validate = await schema.validateAsync(req.body)
        return next();
    } catch (e) {
        console.log(e)
        return res.json({statusCode: 400, ERROR: "validation failed"})
    }
}

module.exports.checkShortCodeUrlValidity = async(req, res, next) =>{
    try{
        let isValid  = await utils.checkValidUrl(req.body.url)
        console.log(isValid)
        if(!isValid) throw new Error('Invalid url');
        return next()
    }catch(e){
        return res.json({statusCode: 400, ERROR:`${req.body.url} is not valid`})
    }
}