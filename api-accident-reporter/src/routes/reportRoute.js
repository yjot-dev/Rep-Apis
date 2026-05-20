import { Router } from "express";
import {
    seleccionar_reportes,
    insertar_reporte,
    actualizar_reporte,
    eliminar_reporte,
    crear_token
} from "../controllers/reportController.js";

const api2 = Router();
const resourcePath = "/reports";

api2.get(resourcePath, seleccionar_reportes);
api2.post(resourcePath, insertar_reporte);
api2.put(`${resourcePath}/:id`, actualizar_reporte);
api2.delete(`${resourcePath}/:id`, eliminar_reporte);
api2.get(`${resourcePath}/token`, crear_token);

export { api2 };