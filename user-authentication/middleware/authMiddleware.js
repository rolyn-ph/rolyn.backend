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
  issuer: process.env.AUTH0_DOMAIN,  // Your Auth0 domain
  algorithms: ['RS256'],
});

module.exports = { checkJwt };

// const { expressjwt: expressJwt } = require('express-jwt');

// const checkJwt = expressJwt({
//   secret: process.env.AUTH0_JWT_SECRET, // Use your Auth0 secret
//   audience: process.env.AUTH0_AUDIENCE, // Your Auth0 audience
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`, // Your Auth0 domain
//   algorithms: ['RS256'], // Algorithm to verify the JWT
// });

// module.exports = checkJwt;