import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Product = sequelize.define("Product",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    }
})
export default Product;