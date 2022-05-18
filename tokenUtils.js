const jwtDecode = require("jwt-decode");

/**
 * Extracts appId from the jwt
 */
module.exports.extractAppId = (token) => (jwtDecode(token).appId);
