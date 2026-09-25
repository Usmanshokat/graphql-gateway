import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('user-db', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});
export default sequelize;