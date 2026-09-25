const ORDER_SERVICE_URL = "http://localhost:3002/graphql";

const orderService = {
  // GET ALL ORDERS
  getOrders: async () => {
    const query = `
      query {
        orders {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(ORDER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET
      },
      body: JSON.stringify({
        query,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.orders;
  },

  // GET SINGLE ORDER
  getOrder: async (id) => {
    const query = `
      query ($id: ID!) {
        order(id: $id) {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(ORDER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET
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

    return result.data.order;
  },

  // CREATE ORDER
  createOrder: async (name, description) => {
    const mutation = `
      mutation ($name: String!, $description: String!) {
        createOrder(
          name: $name
          description: $description
        ) {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(ORDER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          name,
          description,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.createOrder;
  },

  // UPDATE ORDER
  updateOrder: async (id, name, description) => {
    const mutation = `
      mutation (
        $id: ID!
        $name: String!
        $description: String!
      ) {
        updateOrder(
          id: $id
          name: $name
          description: $description
        ) {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(ORDER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id,
          name,
          description,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.updateOrder;
  },

  // DELETE ORDER
  deleteOrder: async (id) => {
    const mutation = `
      mutation ($id: ID!) {
        deleteOrder(id: $id)
      }
    `;

    const response = await fetch(ORDER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_SECRET
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

    return result.data.deleteOrder;
  },
};

export default orderService;