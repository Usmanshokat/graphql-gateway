import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from "./src/config/db.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./src/graphql/schema.js";
import productResolvers from "./src/graphql/resolvers/product.resolver.js";
import contactResolvers from "./src/graphql/resolvers/contact.resolver.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: { ...productResolvers, ...contactResolvers },
    graphiql: true
  })
);
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();