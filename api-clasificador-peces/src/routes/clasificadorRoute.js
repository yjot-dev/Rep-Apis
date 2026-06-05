import { Router } from "express";
import { inferir_pez } from "../controllers/clasificadorController.js";

const api1 = Router();
const resourcePath = "/classify";

api1.post(resourcePath, inferir_pez);

export { api1 };