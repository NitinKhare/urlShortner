const redis = require("redis");

const client = redis.createClient()
client.on('connect', () =>{
    console.log('connected to redis client');
})


module.exports.setAvailableShortCode = async (shortCode) =>{
    const key = 'available_short_codes';
    const save = await client.rpush(key,shortCode)
}

module.exports.removeFromAvailableShortCode = async (shortCode) =>{
    const key = 'availabel_short_codes';
    const remove = await client.lRem(key,1,shortCode)
}

module.exports.getAvailableShortCode = async () =>{
    const key = 'available_short_codes';
    const getAvailableShortCode = await client.lRange(key,0,0);
    return getAvailableShortCode;
}

module.exports.getShortCodeData = async (shortCode)=>{
    const key = 'short_code_data'+shortCode;
    const getKey = await client.get(key)
    return getKey;
}

module.exports.setShortCodeData =async (shortCode, data)=>{
    const key = 'short_code_data'+shortCode;
    const setShortKey = await client.set(key, JSON.stringify(data))
}