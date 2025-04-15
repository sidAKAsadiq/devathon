import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({
    path : './env'
})

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT || 5432, 
  logging: false, 
});

export default sequelize;
