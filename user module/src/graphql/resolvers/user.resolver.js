import bcrypt from "bcryptjs";

import User from "../../models/user.model.js";
import { generateToken } from "../../utils/jwt.js";

const userResolver = {
  // GET ALL USERS
  users: async () => {
    return await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
  },

  // GET SINGLE USER
  user: async ({ id }) => {
    return await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });
  },

  // CREATE USER
  createUser: async ({ name, email, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
  },

  // LOGIN
  login: async ({ email, password }) => {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return {
      token,
      user,
    };
  },

  // UPDATE USER
  updateUser: async ({ id, name, email, role, password }) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.role = role;
    user.password = hashedPassword;

    await user.save();

    return user;
  },

  // DELETE USER
  deleteUser: async ({ id }) => {
    const user = await User.findByPk(id);

    if (!user) {
      return false;
    }

    await user.destroy();

    return true;
  },
};

export default userResolver;