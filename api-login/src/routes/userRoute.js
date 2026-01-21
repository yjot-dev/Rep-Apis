import { Router } from 'express';
const api = Router();
import { findUser, changePasswordUser, insertUser, updateUser, deleteUser, sendEmail } from '../controllers/userController.js';

const resourcePath = '/users';

api.post(`${resourcePath}/login`, findUser);
api.post(`${resourcePath}/email`, sendEmail);
api.post(resourcePath, insertUser);
api.patch(resourcePath, changePasswordUser);
api.put(`${resourcePath}/:id`, updateUser);
api.delete(`${resourcePath}/:id`, deleteUser);

export { api };