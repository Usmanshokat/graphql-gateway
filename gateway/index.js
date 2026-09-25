import "dotenv/config";

console.log("SERVICE SECRET:", process.env.SERVICE_SECRET);

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { graphqlHTTP } from "express-graphql";
import rateLimit from "express-rate-limit";

import schema from "./src/graphql/schema.js";
import resolvers from "./src/graphql/resolvers/gatewayResolver.js";
import authMiddleware from "./src/middleware/auth.middleware.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // maximum 5 requests
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, "public")));

app.use(authMiddleware);

console.log("true");

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: {
      user: req.user,
    },
    customFormatErrorFn: (error) => {
      const code = error.originalError?.code || "INTERNAL_SERVER_ERROR";

      console.error("========== GRAPHQL ERROR ==========");
      console.error("Time:", new Date().toISOString());
      console.error("Message:", error.message);
      console.error("Code:", code);
      console.error("===================================");

      if (code === "INTERNAL_SERVER_ERROR") {
        return {
          message: "Something went wrong",
          code,
        };
      }

      return {
        message: error.message,
        code,
      };
    },
  }))
);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();