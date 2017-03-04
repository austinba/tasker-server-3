import * as tableActions from '../actions/tables';
import { prettyJSON } from '../helpers';
import Models from '../model';
import { tasks as mockTasks } from '../mockAPI/mockData';
import R from 'ramda';
import express from 'express';
import Promise from 'bluebird';
const router = express.Router();

const Task = Models.Task;
router.get('/create-mock-tasks', function(req, res) {

  const mockTasksStringDates = R.pipe(JSON.stringify, JSON.parse)(mockTasks);
  console.log(mockTasks)
  console.log('\n\n\n');
  console.log(mockTasksStringDates)
  Promise.all(R.map(Task.createAsync, mockTasksStringDates))
    .then(R.pipe(prettyJSON, s=>res.send(s)))
    .catch(R.pipe(prettyJSON, s=>res.send(s)));

});
export default router;
