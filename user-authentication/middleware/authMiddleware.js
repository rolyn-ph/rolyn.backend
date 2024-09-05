// jwtCheck uses OAuth2 which aligns with Auth0's best practices
const { auth } = require('express-oauth2-jwt-bearer');

// Middleware to check for a valid JWT token
const jwtCheck = auth({
  audience: 'https://rolyn-api.com', // Replace with your API's identifier
  issuerBaseURL: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com/', // Your Auth0 domain
  tokenSigningAlg: 'RS256'
});

module.exports = { jwtCheck };

/* checkJwt uses the express package which is a more generic method of JWT authentication
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Middleware to validate JWT using Auth0's public key
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS, // Your Auth0 JWKS endpoint
  }),
  audience: process.env.AUTH0_AUDIENCE,  // API identifier from Auth0
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,  // Your Auth0 domain
  algorithms: ['RS256'],
});

module.exports = { checkJwt };
*/