import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { graphqlHTTP } from "express-graphql";

import sequelize from "./src/config/db.js";
import userResolver from "./src/graphql/resolvers/user.resolver.js";
import schema from "./src/graphql/schema.js";
import serviceKeyMiddleware from './src/middleware/serviceKey.middleware.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(serviceKeyMiddleware);
// Frontend is public; only /graphql is protected by the service key
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3004;

console.log(PORT, "check port here");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: userResolver,
    graphiql: true,
  })
);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();