import { Router } from "express";
const api1 = Router();
import {
    obtener_coordenadas
} from "../controllers/geocodingController.js";

const resourcePath = "/geocoding";

api1.get(resourcePath, obtener_coordenadas);

export { api1 };