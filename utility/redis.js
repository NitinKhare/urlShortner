const redis = require("redis");

const client = redis.createClient()
client.on('connect', () => {
    console.log('connected to redis client');
})


module.exports.setAvailableShortCode = async (shortCode) => {
    try {
        const key = 'available_short_codes';
        const save = await client.rpush(key, shortCode)

    } catch (e) {
        return null;
    }
}

module.exports.removeFromAvailableShortCode = async (shortCode) => {
    try {
        const key = 'availabel_short_codes';
        const remove = await client.lRem(key, 1, shortCode)
    } catch (e) {
        return null;
    }
}

module.exports.getAvailableShortCode = async () => {
    try {
        const key = 'available_short_codes';
        const getAvailableShortCode = await client.lRange(key, 0, 0);
        return getAvailableShortCode;
    } catch (e) {
        return null;
    }
}

module.exports.getShortCodeData = async (shortCode) => {
    try {
        const key = 'short_code_data' + shortCode;
        const getKey = await client.get(key)
        return getKey;
    } catch (e) {
        return null;
    }
}

module.exports.setShortCodeData = async (shortCode, data) => {
    try {
        const key = 'short_code_data' + shortCode;
        const setShortKey = await client.set(key, JSON.stringify(data))
    } catch (e) {
        return null;
    }
}