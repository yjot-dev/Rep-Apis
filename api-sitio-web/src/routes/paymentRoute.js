import { Router } from "express";
import { 
    createOrder,
    paypalReturn,
    paypalCancel,
    captureOrder
} from "../controllers/paymentController.js";

const api1 = Router();
const resourcePath = "/payments";

api1.post(`${resourcePath}/create-order`, createOrder);
api1.get(`${resourcePath}/paypal-return`, paypalReturn)
api1.get(`${resourcePath}/paypal-cancel`, paypalCancel)
api1.post(`${resourcePath}/capture-order`, captureOrder);

export { api1 };