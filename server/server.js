const express = require('express');
const path = require('path');
const db = require('./config/connection');

// importing the ApolloServer constructor, its integration with express, our 
// graphQL typedefs and resolvers (which I still need to make), and our authorization check
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const { start } = require('repl');

const app = express();
const PORT = process.env.PORT || 3001;
// creating a new instance of the server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// declaring function for server startup
const startApolloServer = async () => {
  
  // start the Apollo Server instance
  await server.start();

  // still using express data processing 
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // all graphQL requests are routed to the server, and the auth function will add user data
  // if possible
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if server is spun up in a production environment, it needs new path names for associated files.
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`GraphQL listening on http://localhost:${PORT}/graphql`);
  });
  
}

// actually trying to start server
startApolloServer();
