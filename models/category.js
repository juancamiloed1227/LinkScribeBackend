import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Category extends Model { }

Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Category'
});

export {
  Category,
}
