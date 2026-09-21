const prdouctTypeDefs = `#graphql

type Product {
  id: ID!
  name: String!
  description: String!
}

type Query {
  products: [Product!]!
  product(id: ID!): Product
}

type Mutation {
  createProduct(name: String!, description: String!): Product!
  updateProduct(id: ID!, name: String!, description: String!): Product!
  deleteProduct(id: ID!): Boolean!
}

`;

export default prdouctTypeDefs;