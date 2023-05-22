import {Sequelize} from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const name = process.env.NAMEDB||"" ;
const user = process.env.USER||"";
const password = process.env.PASSWORD||"";
const host = process.env.HOST||"";

const db = new Sequelize(name,user,password,{
    host,
    dialect: "mysql",    
    logging: false 
});

export default db;