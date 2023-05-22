import express, { Application } from "express";
import userRoutes from '../routes/semaforo';
import cors from 'cors';

import db from "../db/connection";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    usuarios: '/api/semaforo'
  }

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "";

    //Metodos iniciales
    this.dbConnection();
    this.middlewares();    
    this.routes();

  }


  async dbConnection (){
    try{
      await db.authenticate();
      console.log('Base de datos en linea');

    }catch(error:any){
      throw new Error(error);
    }
  }

  middlewares(){
    // Cors
    this.app.use(cors());

    // Lectura del body
    this.app.use(express.json());

    // Carpeta Publica
    this.app.use(express.static("public"));
  }

  routes(){
    this.app.use(this.apiPaths.usuarios,userRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Localhost:", this.port);
    });
  }
}

export default Server;
