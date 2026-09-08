import { Router } from "express";
import { seleccionar_variedades } from "../controllers/variedadesController.js";

const api1 = Router();
const resourcePath = "/varieties";

api1.get(resourcePath, seleccionar_variedades);

export { api1 };