const { expressjwt: jwt } = require('express-jwt'); // Updated import for express-jwt
const jwksRsa = require('jwks-rsa');

// Middleware to validate JWT tokens issued by Auth0
const jwtCheck = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by Auth0
  secret: jwksRsa.expressJwtSecret({
    cache: true,           // Cache the signing key to improve performance
    rateLimit: true,        // Rate limit the requests to the Auth0 JWKS endpoint
    jwksUri: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com/.well-known/jwks.json'  // Auth0 JWKS URL
  }),

  // Validate the audience and the issuer
  audience: 'https://rolyn-api.com',
  issuer: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com/',
  algorithms: ['RS256']   // Algorithm used by Auth0
});

module.exports = { jwtCheck };


// // jwtCheck uses OAuth2 which aligns with Auth0's best practices
// const { auth } = require('express-oauth2-jwt-bearer');

// // Middleware to check for a valid JWT token
// const jwtCheck = auth({
//     audience: 'https://rolyn-api.com', // Replace with your API's identifier
//     issuerBaseURL: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com/', // Your Auth0 domain
//     tokenSigningAlg: 'RS256'
// });

// module.exports = { jwtCheck };