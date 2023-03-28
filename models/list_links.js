import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class ListLink extends Model { }

ListLink.init({
  listId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  linkId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ListLink'
});

export {
  ListLink,
}
