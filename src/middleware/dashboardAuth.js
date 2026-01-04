/**
 * Dashboard authentication middleware
 * Checks HttpOnly cookie `dashboard_auth` against API_KEY
 * Falls back to X-Api-Key header for programmatic access
 */
module.exports = function dashboardAuth(req, res, next) {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === '' || apiKey === 'your_api_key_here') return next();

    // Prefer cookie (set on login)
    const cookieVal = req.cookies && req.cookies.dashboard_auth;
    const headerVal = req.headers['x-api-key'];

    if (cookieVal && cookieVal === apiKey) return next();
    if (headerVal && headerVal === apiKey) return next();

    return res.status(401).json({ success: false, message: 'Unauthorized' });
};
