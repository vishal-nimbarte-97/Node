const pool = require("../config/db");
const { readCache, writeCache } = require('../utils/cache');

exports.getAllOrders = async () => {
    // Check cache, expire after 60 seconds
    const cachedOrders = readCache('orders', 60);
    if (cachedOrders) {
        console.log('Returning orders from cache');
        return cachedOrders;
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
        writeCache('orders', rows);
        console.log('Returning fresh orders from DB');

        return rows;
    } catch (error) {
        throw new Error("Failed to fetch orders");
    }
};
