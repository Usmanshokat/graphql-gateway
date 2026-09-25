const USER_SERVICE_URL = "http://localhost:3004/graphql";

console.log(
  USER_SERVICE_URL,
  process.env.SERVICE_SECRET,
  "User Service 1"
);

const userService = {
  // GET ALL USERS
  getUsers: async () => {
    const query = `
      query {
        users {
          id
          name
          email
          role
        }
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.users;
  },

  // GET SINGLE USER
  getUser: async (id) => {
    const query = `
      query ($id: ID!) {
        user(id: $id) {
          id
          name
          email
          role
        }
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query,
        variables: {
          id,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.user;
  },

  // CREATE USER
  createUser: async (name, email, password, role) => {
    const mutation = `
      mutation (
        $name: String!
        $email: String!
        $password: String!
        $role: UserRole
      ) {
        createUser(
          name: $name
          email: $email
          password: $password
          role: $role
        ) {
          id
          name
          email
          role
        }
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          name,
          email,
          password,
          role,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.createUser;
  },

  // UPDATE USER
  updateUser: async (id, name, email, password, role) => {
    const mutation = `
      mutation (
        $id: ID!
        $name: String!
        $email: String!
        $password: String!
        $role: UserRole
      ) {
        updateUser(
          id: $id
          name: $name
          email: $email
          password: $password
          role: $role
        ) {
          id
          name
          email
          role
        }
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id,
          name,
          email,
          password,
          role,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.updateUser;
  },

  // DELETE USER
  deleteUser: async (id) => {
    const mutation = `
      mutation ($id: ID!) {
        deleteUser(id: $id)
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.deleteUser;
  },

  // LOGIN
  login: async (email, password) => {
    const mutation = `
      mutation ($email: String!, $password: String!) {
        login(
          email: $email
          password: $password
        ) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
    `;

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          email,
          password,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.login;
  },
};

export default userService;