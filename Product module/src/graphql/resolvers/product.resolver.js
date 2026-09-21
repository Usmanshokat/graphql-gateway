import Product from "../../models/product.model.js";

const productResolvers = {
  products: async () => {
    return await Product.findAll();
  },

  product: async ({ id }) => {
    return await Product.findByPk(id);
  },

  createProduct: async ({ name, description }) => {
    return await Product.create({
      name,
      description
    });
  },

  updateProduct: async ({ id, name, description }) => {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new Error("product not found");
    }

    product.name = name;
    product.description = description;

    await product.save();

    return product;
  },

  deleteProduct: async ({ id }) => {
    const product = await Product.findByPk(id);

    if (!product) {
      return false;
    }

    await product.destroy();

    return true;
  }
};
export default productResolvers;