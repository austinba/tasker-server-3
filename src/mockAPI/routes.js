import * as api from './index';
import express from 'express';
const router = express.Router();

const routeHandler = (apiFn) => (req, res) => {
  console.log(req.path);
  console.log(req.body);
  console.log('');
  apiFn(req.body)
    .then(data => typeof data !== 'object' ? {data} : data)
    .then(data => res.send(data))
    .catch(err => res.sendStatus(500));
}

router.post('/checkin', routeHandler(api.checkIn));
router.post('/cancel-checkin', routeHandler(api.cancelCheckIn));
router.post('/get-my-tasks', routeHandler(api.getMyTasks));
router.post('/get-tasks-ive-assigned', routeHandler(api.getTasksIveAssigned));
router.post('/addTask', routeHandler(api.addTask));
router.post('/editTask', routeHandler(api.editTask));
router.post('/saveComment', routeHandler(api.saveComment));
router.post('/getUsers', routeHandler(api.getUsers));
router.post('/markComplete', routeHandler(api.markComplete));
router.post('/markDeleted', routeHandler(api.markDeleted));
router.post('/unmarkComplete', routeHandler(api.unmarkComplete));
router.post('/unmarkDeleted', routeHandler(api.unmarkDeleted));

export default router;
