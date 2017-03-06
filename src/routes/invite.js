import * as api from '../api/index';
import { routeHandler } from './utilities';
import express from 'express';
const router = express.Router();

router.post('/new', routeHandler(api.invite));

export default router;
