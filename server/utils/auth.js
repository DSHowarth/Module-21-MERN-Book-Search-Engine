const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // GraphQL error to simplify our authentication resolver code
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  // function for our authenticated routes
  authMiddleware: function ({req}) {
    // allows token to be sent via  req.query or headers
    console.log('accessed middleware')
    let token = req.headers.authorization;
    console.log(token)
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      console.log('entered split token')
      token = token.split(' ').pop().trim();
      console.log('split token')
    }

    // if no token is found, add nothing to the req object
    if (!token) {
      console.log('no token found')
      return req;
    }

    // verify token and get user data out of it
    try {
      // if the user matches the token, add user data to req object for use by server
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // no longer using next, as this function isn't the middleware anymore, expressMiddleware is.
    return req;
  },
  // signToken function unchanged
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
