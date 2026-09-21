const contactTypeDefs = `#graphql
type Contact {
    id: ID!
    fullname: String!
    email: String!
    number: String!
    message: String!
}
type ContactResponse {
    message: String!
    data: Contact!
}

extend type Mutation {
    createContact(
        fullname: String!
        email: String!
        number: String!
        message: String!
    ): ContactResponse!
}
`;

export default contactTypeDefs;