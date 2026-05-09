import { Router } from "express";
import { 
    createOrder,
    paypalReturn,
    paypalCancel,
    captureOrder,
    selectPayments
} from "../controllers/paymentController.js";

const api3 = Router();
const resourcePath = "/payments";

api3.post(`${resourcePath}/create-order`, createOrder);
api3.get(`${resourcePath}/paypal-return`, paypalReturn)
api3.get(`${resourcePath}/paypal-cancel`, paypalCancel)
api3.post(`${resourcePath}/capture-order`, captureOrder);
api3.get(resourcePath, selectPayments);

export { api3 };