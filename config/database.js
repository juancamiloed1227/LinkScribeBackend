import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config()

console.log(process.env.DB_USERNAME)

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
    port: 5432,
    logging: console.log,
    dialect: 'postgres',
});

export {
  sequelize,
}
