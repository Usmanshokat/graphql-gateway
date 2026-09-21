import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('order-db', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});
export default sequelize;