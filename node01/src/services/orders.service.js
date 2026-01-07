const pool = require("../config/db");
// const { readCache, writeCache } = require('../utils/cache');
const redisClient = require("../config/redis");

exports.getAllOrders = async () => {

    // this is handle using temp.json file similar to the cache but they are creating manually
    // Check cache, expire after 60 seconds
    // const cachedOrders = readCache('orders', 60);
    // if (cachedOrders) {
    //     console.log('Returning orders from cache');
    //     return cachedOrders;
    // }

    const cacheKey = "orders:all";

    // 1️⃣ Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        console.log("Response from Redis cache");
        return JSON.parse(cachedData);
    }

    // Fetch from DB
    const query = `
        SELECT 
            id, customer_name, product, quantity, price, status, order_date 
        FROM orders 
        ORDER BY order_date ASC
    `;

    try {
        const { rows } = await pool.query(query);

        // Save to cache
        // writeCache('orders', rows);
        // console.log('Returning fresh orders from DB');

        // 3️⃣ Save in Redis (1 minute)
        await redisClient.setEx(cacheKey, 60, JSON.stringify(rows));
        console.log('Returning fresh orders from DB');

        return rows;
    } catch (error) {
        throw new Error("Failed to fetch orders");
    }
};
