import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('product-db', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});
export default sequelize;