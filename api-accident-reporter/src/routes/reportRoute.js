import { Router } from "express";
const api2 = Router();
import {
    seleccionar_reportes,
    insertar_reporte,
    actualizar_reporte,
    eliminar_reporte
} from "../controllers/reportController.js";

const resourcePath = "/reports";

api2.get(resourcePath, seleccionar_reportes);
api2.post(resourcePath, insertar_reporte);
api2.put(`${resourcePath}/:id`, actualizar_reporte);
api2.delete(`${resourcePath}/:id`, eliminar_reporte);

export { api2 };