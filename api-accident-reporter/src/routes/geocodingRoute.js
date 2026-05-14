import { Router } from "express";
import {
    obtener_coordenadas
} from "../controllers/geocodingController.js";

const api1 = Router();
const resourcePath = "/geocoding";

api1.get(resourcePath, obtener_coordenadas);

export { api1 };