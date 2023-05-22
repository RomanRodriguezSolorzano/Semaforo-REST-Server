import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const validacion = (req: Request, res: Response, next: Function) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json(error);
  }
  next();
};
