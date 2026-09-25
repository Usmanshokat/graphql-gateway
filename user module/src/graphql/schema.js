import { buildSchema } from "graphql";
import userTypeDefs from "./typeDefs/user.type.js";

const typeDefs = userTypeDefs;
const schema = buildSchema(typeDefs);
export default schema;