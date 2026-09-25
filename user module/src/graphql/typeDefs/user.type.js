const userTypeDefs = `#graphql

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

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(
    name: String!
    email: String!
    password: String!
    role: UserRole
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

export default userTypeDefs;