import { Router } from "express";
import { 
    sendNotification, 
    selectNotification 
} from "../controllers/notificationController.js";

const api4 = Router();
const resourcePath = "/notifications";

api4.post(resourcePath, sendNotification);
api4.get(resourcePath, selectNotification)

export { api4 };