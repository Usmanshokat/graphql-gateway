import Order from "../../models/order.model.js";

const orderResolvers = {
  orders: async () => {
    return await Order.findAll();
  },

  order: async ({ id }) => {
    return await Order.findByPk(id);
  },

  createOrder: async ({ name, description }) => {
    return await Order.create({
      name,
      description
    });
  },

  updateOrder: async ({ id, name, description }) => {
    const item = await Order.findByPk(id);

    if (!item) {
      throw new Error("Item not found");
    }

    item.name = name;
    item.description = description;

    await item.save();

    return item;
  },

  deleteItem: async ({ id }) => {
    const item = await Order.findByPk(id);

    if (!item) {
      return false;
    }

    await item.destroy();

    return true;
  }
};
export default orderResolvers;