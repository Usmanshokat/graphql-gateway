const gatewayTypeDefs = `#graphql

  type Product {
    id: ID!
    name: String!
    description: String!
  }

  type Order {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product

    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
    ): Product!

    updateProduct(
      id: ID!
      name: String!
      description: String!
    ): Product!

    deleteProduct(id: ID!): Boolean!

    createOrder(
      name: String!
      description: String!
    ): Order!

    updateOrder(
      id: ID!
      name: String!
      description: String!
    ): Order!

    deleteOrder(id: ID!): Boolean!
  }

`;

export default gatewayTypeDefs;