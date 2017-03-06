import * as api from '../api/index';
import { routeHandler } from './utilities';
import express from 'express';
const router = express.Router();

router.post('/checkin', routeHandler(api.checkIn));
router.post('/cancel-checkin', routeHandler(api.cancelCheckIn));
router.post('/get-my-tasks', routeHandler(api.getMyTasks));
router.post('/get-tasks-ive-assigned', routeHandler(api.getTasksIveAssigned));
router.post('/addTask', routeHandler(api.addTask));
router.post('/editTask', routeHandler(api.editTask));
router.post('/saveComment', routeHandler(api.saveComment));
router.post('/markComplete', routeHandler(api.markComplete));
router.post('/markDeleted', routeHandler(api.markDeleted));
router.post('/unmarkComplete', routeHandler(api.unmarkComplete));
router.post('/unmarkDeleted', routeHandler(api.unmarkDeleted));

export default router;
