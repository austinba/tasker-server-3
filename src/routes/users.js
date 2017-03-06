import * as api from '../api/index';
import express from 'express';
import { routeHandler } from './utilities';
const router = express.Router();

router.post('/getUsers', routeHandler(api.getUsers));

export default router;
