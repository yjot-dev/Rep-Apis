import { Router } from "express";
import { inferir_banana } from "../controllers/clasificadorController.js";

const api1 = Router();
const resourcePath = "/classify";

api1.post(resourcePath, inferir_banana);

export { api1 };