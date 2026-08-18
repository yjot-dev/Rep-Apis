import { Router } from "express";
import { seleccionar_especies } from "../controllers/clasificadorController.js";

const api1 = Router();
const resourcePath = "/species";

api1.get(resourcePath, seleccionar_especies);

export { api1 };