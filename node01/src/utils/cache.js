// const fs = require('fs');
// const path = require('path');

// const cacheFilePath = path.join(__dirname, '../temp.json');

// // Read cache with expiration
// function readCache(key, expireInSeconds = 60) { // default 60 seconds
//     if (!fs.existsSync(cacheFilePath)) return null;

//     const data = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
//     const cachedItem = data[key];

//     if (!cachedItem) return null;

//     // Check expiration
//     const now = Date.now();
//     if (now - cachedItem.timestamp > expireInSeconds * 1000) {
//         return null; // expired
//     }

//     return cachedItem.value;
// }

// // Write cache with timestamp
// function writeCache(key, value) {
//     let data = {};
//     if (fs.existsSync(cacheFilePath)) {
//         data = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
//     }

//     data[key] = {
//         value,
//         timestamp: Date.now()
//     };

//     fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2));
// }

// module.exports = { readCache, writeCache };
