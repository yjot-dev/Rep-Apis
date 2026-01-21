import { Router } from 'express';
const api = Router();
import { findUser, updateUser, changePasswordUser, insertUser, deleteUser, sendEmail, sendComment } from '../controllers/userController.js';

const resourcePath = '/users';

api.post(`${resourcePath}/login`, findUser);
api.post(resourcePath, insertUser);
api.put(`${resourcePath}/:id`, updateUser);
api.patch(resourcePath, changePasswordUser);
api.delete(`${resourcePath}/:id`, deleteUser);
api.post(`${resourcePath}/email`, sendEmail);
api.post(`${resourcePath}/commentary`, sendComment);

export { api };