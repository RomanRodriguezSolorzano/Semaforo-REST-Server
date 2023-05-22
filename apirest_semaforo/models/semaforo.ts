import {DataTypes} from 'sequelize';
import db from '../db/connection';

const Semaforo = db.define('Semaforo',{
    cantidadCarros:{
        type: DataTypes.INTEGER
    },
    inicioFecha: {
        type: DataTypes.STRING
    },
    finalFecha: {
        type: DataTypes.STRING
    },
    dispositivoId: {
        type: DataTypes.STRING
    },
    colorId: {
        type: DataTypes.STRING
    },
    inicioHora: {
        type: DataTypes.STRING
    },
    finalHora: {
        type: DataTypes.STRING
    },
    
});

export default Semaforo;