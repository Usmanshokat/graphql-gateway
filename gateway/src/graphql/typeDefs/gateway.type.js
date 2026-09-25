const gatewayTypeDefs = `#graphql

  enum UserRole {
    USER
    ADMIN
    SUPER_ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

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

    users: [User!]!
    user(id: ID!): User
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

    createUser(
      name: String!
      email: String!
      password: String!
      role: UserRole
    ): User!

    register(
      name: String!
      email: String!
      password: String!
    ): User!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    updateUser(
      id: ID!
      name: String!
      email: String!
      password: String!
      role: UserRole
    ): User!

    deleteUser(id: ID!): Boolean!
  }

`;

export default gatewayTypeDefs;