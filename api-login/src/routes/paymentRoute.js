import { Router } from "express";
import { 
    selectPayments,
    validatePayment
} from "../controllers/paymentController.js";

const api3 = Router();
const resourcePath = "/payments";

api3.get(resourcePath, selectPayments);
api3.post(resourcePath, validatePayment);

export { api3 };