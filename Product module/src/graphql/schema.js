import { buildSchema } from "graphql";
import productTypeDefs from "./typsDefs/product.type.js";
import contactTypeDefs from "./typsDefs/contact.type.js";

const typeDefs = `${productTypeDefs}${contactTypeDefs}`;
const schema = buildSchema(typeDefs);
export default schema;