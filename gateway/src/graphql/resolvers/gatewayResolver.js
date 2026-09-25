import productService from "../../services/product.service.js";
import orderService from "../../services/order.service.js";
import userService from "../../services/user.service.js";

import authorize from "../../middleware/role.middleware.js";
import { validationRequired } from "../../utils/validation.js";
import AppError from "../../utils/appError.js";

const resolvers = {
  // =========================
  // PRODUCTS
  // =========================

  products: async (args, context) => {
    if (!context.user) {
      throw new AppError(
        "Authentication required",
        "UNAUTHENTICATED"
      );
    }

    return await productService.getProducts();
  },

  product: async ({ id }, context) => {
    if (!context.user) {
      throw new AppError(
        "Authentication required",
        "UNAUTHENTICATED"
      );
    }

    return await productService.getProduct(id);
  },

  // =========================
  // ORDERS
  // =========================

  orders: async (args, context) => {
    if (!context.user) {
      throw new AppError(
        "Authentication required",
        "UNAUTHENTICATED"
      );
    }

    return await orderService.getOrders();
  },

  order: async ({ id }, context) => {
    if (!context.user) {
      throw new AppError(
        "Authentication required",
        "UNAUTHENTICATED"
      );
    }

    return await orderService.getOrder(id);
  },

  // =========================
  // USERS
  // =========================

  users: async (args, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    return await userService.getUsers();
  },

  user: async ({ id }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    return await userService.getUser(id);
  },

  // =========================
  // PRODUCT MUTATIONS
  // =========================

  createProduct: async ({ name, description }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    validationRequired(name, "Product name");
    validationRequired(description, "Product description");

    return await productService.createProduct(
      name,
      description
    );
  },

  updateProduct: async ({ id, name, description }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    validationRequired(name, "Product name");
    validationRequired(description, "Product description");

    return await productService.updateProduct(
      id,
      name,
      description
    );
  },

  deleteProduct: async ({ id }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    return await productService.deleteProduct(id);
  },

  // =========================
  // ORDER MUTATIONS
  // =========================

  createOrder: async ({ name, description }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    validationRequired(name, "Order name");
    validationRequired(description, "Order description");

    return await orderService.createOrder(
      name,
      description
    );
  },

  updateOrder: async ({ id, name, description }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    validationRequired(name, "Order name");
    validationRequired(description, "Order description");

    return await orderService.updateOrder(
      id,
      name,
      description
    );
  },

  deleteOrder: async ({ id }, context) => {
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    return await orderService.deleteOrder(id);
  },

  // =========================
  // USER MUTATIONS
  // =========================

  createUser: async (
    { name, email, password, role },
    context
  ) => {

    validationRequired(name, "User name");
    validationRequired(email, "User email");
    validationRequired(password, "User password");

    return await userService.createUser(
      name,
      email,
      password,
      role
    );
  },

  login: async ({ email, password }) => {
    validationRequired(email, "Email");
    validationRequired(password, "Password");

    return await userService.login(email, password);
  },

  updateUser: async (
    { id, name, email, password, role },
    context
  ) => {

    validationRequired(name, "User name");
    validationRequired(email, "User email");
    validationRequired(password, "User password");

    return await userService.updateUser(
      id,
      name,
      email,
      password,
      role
    );
  },

  deleteUser: async ({ id }, context) => {
    console.log(id , context , 'check both here delete')
    authorize("ADMIN", "SUPER_ADMIN")(context.user);

    return await userService.deleteUser(id);
  },
};

export default resolvers;