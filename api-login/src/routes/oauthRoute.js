import { Router } from "express";
const api2 = Router();
import {
  googleLogin,
  googleCallback,
  emailSend
} from "../controllers/oauthController.js";

const resourcePath = "/oauth";

api2.get(`${resourcePath}/login`, googleLogin);
api2.get(`${resourcePath}/oauth2callback`, googleCallback);
api2.post(`${resourcePath}/email`, emailSend);

export { api2 };