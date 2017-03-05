import * as api from './index';
import R from 'ramda';
import Promise from 'bluebird';
import express from 'express';
const routeReporter = (req, res, next) => {
  console.log(req.path);
  console.log(req.body);
  console.log('');
  next();
}

const router = express.Router();
router.use(routeReporter);

const routeHandler = (apiFn) => (req, res) => {
  apiFn(req.body)
    .then(data => typeof data !== 'object' ? {data} : data)
    .then(data => res.send(data))
    .catch(err => console.log(err) || res.sendStatus(500));
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
