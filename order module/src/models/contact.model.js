import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Contact = sequelize.define("Contact", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullname:{
     type:DataTypes.STRING,
     allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    },
    number:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.TEXT,
        allowNull:false
    }
}   
)
export default Contact;