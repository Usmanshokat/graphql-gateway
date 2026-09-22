const orderTypeDefs = `#graphql

type Order {
  id: ID!
  name: String!
  description: String!
}

type Query {
  orders: [Order!]!
  order(id: ID!): Order
}

type Mutation {
  createOrder(name: String!, description: String!): Order!
  updateOrder(id: ID!, name: String!, description: String!): Order!
  deleteOrder(id: ID!): Boolean!
}

`;

export default orderTypeDefs;