import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@pic-cube/api-schema/graphql/typeDefs';
import { resolvers } from './resolvers';

dotenv.config();

const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

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
app.listen(port);

if (!isProduction) {
  console.log(`Running pic-cube API server at http://localhost:${port}`);
}
