process.env.NODE_ENV = 'dev';
// 'import' hoists so use 'require' so we can set NODE_ENV first.
const actions = require('../tasks');

import R from 'ramda';
import uuid from 'uuid/v4'; // random UUID, not time-based
const newTaskID = uuid();

const newTask =
  {
    description: 'TESTING: this is created by a test',
    assignedFrom: 'austin@qs',
    dueDate: new Date(2017, 4, 1),
    level: 1,
  };

// tests getTasksIveAssigned and getMyTasks
const test1 = () =>
  Promise.all([
    // actions.getTasksIveAssigned(),
    actions.getMyTasks(),
  ])
  .then(console.log)
  .catch(console.log.bind(null, 'error'));

test1();

// edit a task
const test2 = () =>
  actions.editTask({taskID: '00000000-0000-0000-0000-000000000201', taskDetails: {description: 'work harder'}})
  .then(console.log)
  .catch(console.log.bind(null, 'error'));

// test2();

// edit a task, try to dual associate (should fail)
const test3 = () =>
  actions.editTask({
    taskID: '00000000-0000-0000-0000-000000000201',
    taskDetails: {
      assignedTo: '00austin@qs' }
    })
  .then(console.log)
  .catch(console.log.bind(null, 'error'));

// test3();

// edit a task, try to non-associate (should fail)
const test4 = () =>
  actions.editTask({
    taskID: '00000000-0000-0000-0000-000000000201',
    taskDetails: {
      assignedTo: '00000000-0000-0000-0000-000000000104' }
    })
  .then(console.log)
  .catch(console.log.bind(null, 'error'));

// test4();

// edit a task, try explicitly dual-associate (succeeds but ignoring assignedFrom)
const test5 = () =>
  actions.editTask({
    taskID: '00000000-0000-0000-0000-000000000202',
    taskDetails: {
      assignedTo:   'austin@qs',
      assignedFrom: 'austin@qs' }
    })
  .then(console.log)
  .catch(console.log.bind(null, 'error'));

// test5();
