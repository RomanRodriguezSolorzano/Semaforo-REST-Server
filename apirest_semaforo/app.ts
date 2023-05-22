/* Importaciones */
import dotenv from 'dotenv';
import Server from './models/server';

/* Configuracion de dotenv */
dotenv.config();

/* Creacion de la instancia del server */
const server = new Server();

/* Levantamiento del server */
server.listen();
