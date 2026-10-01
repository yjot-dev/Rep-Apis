import { Router } from "express";
import {
    findUser,
    changePasswordUser,
    insertUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const api1 = Router();
const resourcePath = "/users";

api1.post(`${resourcePath}/login`, findUser);
api1.post(resourcePath, insertUser);
api1.patch(resourcePath, changePasswordUser);
api1.put(`${resourcePath}/:id`, updateUser);
api1.delete(`${resourcePath}/:id`, deleteUser);

export { api1 };