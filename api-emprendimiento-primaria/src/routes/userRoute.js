import { Router } from "express";
const api1 = Router();
import {
    findUser,
    updateUser,
    changePasswordUser,
    insertUser,
    deleteUser
} from "../controllers/userController.js";

const resourcePath = "/users";

api1.post(`${resourcePath}/login`, findUser);
api1.post(resourcePath, insertUser);
api1.put(`${resourcePath}/:id`, updateUser);
api1.patch(resourcePath, changePasswordUser);
api1.delete(`${resourcePath}/:id`, deleteUser);

export { api1 };