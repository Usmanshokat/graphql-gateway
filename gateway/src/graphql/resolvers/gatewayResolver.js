import productService from "../../services/product.service.js";
import orderService from "../../services/order.service.js";

const resolvers = {
  // PRODUCTS
  products: async () => {
    return await productService.getProducts();
  },

  product: async ({ id }) => {
    return await productService.getProduct(id);
  },

  // ORDERS
  orders: async () => {
    return await orderService.getOrders();
  },

  order: async ({ id }) => {
    return await orderService.getOrder(id);
  },

  // PRODUCT MUTATIONS
  createProduct: async ({ name, description }) => {
    return await productService.createProduct(
      name,
      description
    );
  },

  updateProduct: async ({ id, name, description }) => {
    return await productService.updateProduct(
      id,
      name,
      description
    );
  },

  deleteProduct: async ({ id }) => {
    return await productService.deleteProduct(id);
  },

  // ORDER MUTATIONS
  createOrder: async ({ name, description }) => {
    return await orderService.createOrder(
      name,
      description
    );
  },

  updateOrder: async ({ id, name, description }) => {
    return await orderService.updateOrder(
      id,
      name,
      description
    );
  },

  deleteOrder: async ({ id }) => {
    return await orderService.deleteOrder(id);
  },
};

export default resolvers;