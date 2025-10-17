// Middleware để log các request đáng ngờ
const logSuspiciousActivity = (req, res, next) => {
    const { url, method, body, query } = req;

    // Log các request có thể chứa payload tấn công
    const suspiciousPatterns = [
        /<script/i,
        /union.*select/i,
        /drop.*table/i,
        /exec\(/i,
        /system\(/i,
        /\.\.\//,
        /javascript:/i,
    ];

    const requestString = JSON.stringify({ url, method, body, query });
    const isSuspicious = suspiciousPatterns.some((pattern) =>
        pattern.test(requestString)
    );

    if (isSuspicious) {
        console.log(`🚨 [SECURITY] Suspicious activity detected:`);
        console.log(`   Method: ${method}`);
        console.log(`   URL: ${url}`);
        console.log(`   Body: ${JSON.stringify(body)}`);
        console.log(`   Query: ${JSON.stringify(query)}`);
        console.log(`   IP: ${req.ip}`);
        console.log(`   User-Agent: ${req.get("User-Agent")}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    next();
};

// Middleware để set security headers (cố tình không set để dễ demo)
const setSecurityHeaders = (req, res, next) => {
    // Không set X-Frame-Options để cho phép iframe (dễ demo clickjacking)
    // Không set X-XSS-Protection để dễ demo XSS
    // Không set Content-Security-Policy để dễ demo XSS

    next();
};

module.exports = {
    logSuspiciousActivity,
    setSecurityHeaders,
};
