import { buildSchema } from "graphql";
import gatewayTypeDefs from "./typeDefs/gateway.type.js";

const typeDefs = gatewayTypeDefs;
const schema = buildSchema(typeDefs);
export default schema;