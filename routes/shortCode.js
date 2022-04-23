const express = require('express');
const { createShortCodeValidation, checkShortCodeUrlValidity } = require('../middleware/getShortCode.validation');
const router = express.Router();
const shortCodeService = require('../Service/shortLink')

router.post("/shorten", createShortCodeValidation, checkShortCodeUrlValidity, async (req, res, next) => {
    try {
        let shortCodeResp = await shortCodeService.create(req.body)
        console.log(shortCodeResp)
        if(!shortCodeResp || shortCodeResp.error || ! shortCodeResp?.data?.short_code) throw new Error(shortCodeResp?.message || "couldn't create short code");
        return res.status(201).json({shortcode:shortCodeResp?.data?.short_code})
    } catch (error) {
        return res.status(406).json({ERROR:error.message})
    }
})


router.get("/:shortcode", async(req, res, next) => {
    try{
    let shortCodeResp =  await shortCodeService.redirect(req.params.shortcode)
    console.log("shortcode resp ", shortCodeResp)
    if(!shortCodeResp || shortCodeResp.error || !shortCodeResp?.shortCode?.short_code){
        throw new Error(shortCodeResp.message || 'Link Does not exists')
    }
    res.redirect(shortCodeResp.shortCode.url)

    }catch(e){
        res.status(404).json({ERROR: e.message})
    }
})

router.get("/:shortcode/stats", async (req, res, next) => {
    try{
        let shortCodeResp =  await shortCodeService.getStats(req.params.shortcode)
        console.log("shortcode resp ", shortCodeResp)
        if(!shortCodeResp || shortCodeResp.error || !shortCodeResp?.data?.short_code){
            throw new Error(shortCodeResp.message || 'Link Does not exists')
        }
        res.status(200).json({startDate: shortCodeResp.data.start_date, lastSeenDate: shortCodeResp.data.last_seen_date, redirectCount: shortCodeResp.data.redirect_count})
    
        }catch(e){
            res.status(404).json({ERROR: e.message})
        }
})

module.exports = router;