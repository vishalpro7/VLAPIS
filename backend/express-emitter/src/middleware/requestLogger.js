const { timeStamp } = require("console");
const crypto = require("crypto");

function requestLogger(req, res, next) {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const endTime = process.hrtime.bigint();

        const responseTimeMs = 
            Number(endTime - startTime) / 1_000_000;

        const log = {
            timestamp : new Date().toISOString(),
            request_id: crypto.randomUUID(), 
            endpoint : req.originalUrl, 
            method : req.method, 
            status : res.statusCode, 
            response_time_ms : Number(responseTimeMs.toFixed(2)), 
            ip : req.ip, 
            user_id : req.headers["x-user-id"] || null
        };

        console.log(JSON.stringify(log));
    });

    next();
}

module.exports = requestLogger;