import { buildSchema } from "graphql";
import orderTypeDefs from "./typsDefs/order.type.js";
import contactTypeDefs from "./typsDefs/contact.type.js";

const typeDefs = `${orderTypeDefs}${contactTypeDefs}`;
const schema = buildSchema(typeDefs);
export default schema;