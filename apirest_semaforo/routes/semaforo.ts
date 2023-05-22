import { Router } from "express";
import { check } from "express-validator";

import {validacion} from "../middleware/validar";

import {
  getSemaforoMinuto,
  getSemaforoHora,
  getSemaforoDia,
  postSemaforo,  
} from "../controllers/semaforo";

const router = Router();

router.get("/minuto", getSemaforoMinuto);
router.get("/hora", getSemaforoHora);
router.get("/dia", getSemaforoDia);

router.post("/",[
  check("cantidadCarros", "Debe de enviar la cantidad de carros").notEmpty(),
  check("inicioFecha", "No tiene la fecha").notEmpty(),
  check("finalFecha", "Debe enviar un email valido").notEmpty(),
  check("dispositivoId", "Debe enviar un email valido").notEmpty(),
  check("colorId", "Debe enviar un email valido").notEmpty(),
  check("inicioHora", "Debe enviar un email valido").notEmpty(),
  check("finalHora", "Debe enviar un email valido").notEmpty(),
  validacion  
], postSemaforo);

export default router;