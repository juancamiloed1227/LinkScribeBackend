import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class List extends Model { }

List.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'List'
});

export {
  List,
}
