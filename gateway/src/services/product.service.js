const PRODUCT_SERVICE_URL = "http://localhost:3001/graphql";

const productService = {
  // GET ALL PRODUCTS
  getProducts: async () => {
    const query = `
      query {
        products {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.products;
  },

  // GET SINGLE PRODUCT
  getProduct: async (id) => {
    const query = `
      query ($id: ID!) {
        product(id: $id) {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return result.data.product;
  },

  // CREATE PRODUCT
  createProduct: async (name, description) => {
    const mutation = `
      mutation ($name: String!, $description: String!) {
        createProduct(
          name: $name
          description: $description
        ) {
          id
          name
          description
        }
      }
    `;

    const response = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return result.data.createProduct;
  },

  // UPDATE PRODUCT
  updateProduct: async (id, name, description) => {
    const mutation = `
      mutation (
        $id: ID!
        $name: String!
        $description: String!
      ) {
        updateProduct(
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

    const response = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return result.data.updateProduct;
  },

  // DELETE PRODUCT
  deleteProduct: async (id) => {
    const mutation = `
      mutation ($id: ID!) {
        deleteProduct(id: $id)
      }
    `;

    const response = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return result.data.deleteProduct;
  },
};

export default productService;