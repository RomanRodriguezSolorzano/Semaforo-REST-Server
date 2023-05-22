import { Request, Response } from "express";
import {QueryTypes  } from "sequelize";
import Semaforo from "../models/semaforo";
import sequealize from '../db/connection';

export const getSemaforoMinuto = async (req: Request, res: Response) => {
  const semaforo = await sequealize.query('SELECT SUM(cantidadCarros) as carros, inicioFecha as fecha, CONCAT(TIME_FORMAT(inicioHora, "%i:%s")," - ",TIME_FORMAT(finalHora, "%i:%s")) as rango, c.nombre FROM semaforos s inner join color c on c.Id = s.colorId GROUP BY MINUTE(inicioHora), HOUR(inicioHora),day(inicioFecha ), s.colorId ORDER BY s.id DESC limit 15;', { type: QueryTypes.SELECT });  
  res.json( semaforo);
};

export const getSemaforoHora = async (req: Request, res: Response) => {
  const semaforo = await sequealize.query('SELECT SUM(cantidadCarros) as carros, inicioFecha as fecha, CONCAT(TIME_FORMAT(inicioHora, "%h:00 %p")," a las ", TIME_FORMAT(ADDTIME(inicioHora, "01:00:00"), "%h:00 %p")) as rango, c.nombre FROM semaforos s inner join color c on c.Id = s.colorId GROUP BY hour(inicioHora), day(inicioFecha ), s.colorId ORDER BY s.id DESC limit 15;', { type: QueryTypes.SELECT });
  res.json( semaforo);
};

export const getSemaforoDia = async (req: Request, res: Response) => {
  const semaforo = await sequealize.query('SELECT SUM(cantidadCarros) as carros, CONCAT(DATE_FORMAT(inicioFecha,"%d de %M")," al ",DATE_FORMAT(date_add(inicioFecha, interval 1 day),"%d de %M")) as rango, c.nombre FROM semaforos s inner join color c on c.Id = s.colorId GROUP BY day(inicioFecha ), s.colorId ORDER BY s.id DESC limit 15;', { type: QueryTypes.SELECT });
  res.json( semaforo);
};

export const postSemaforo = async (req: Request, res: Response) => {
  const { body } = req;
  try {    
    const usuario = await Semaforo.create(body);    
    await usuario.save();
    res.json({
      usuario,
      msg: "Semaforo agregado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

