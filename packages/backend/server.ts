import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@pic-cube/api-schema/graphql/typeDefs';
import { resolvers } from './resolvers';
import { staticMiddleware } from './middleware/serve-static';

const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const staticDir = process.env.SCANNER_BASE_PATH || '';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_ENDPOINT,
  })
);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: !isProduction,
  })
);
app.use('/static', staticMiddleware(staticDir));
app.listen(port);

if (!isProduction) {
  console.log(`Running pic-cube API server at http://localhost:${port}`);
}
