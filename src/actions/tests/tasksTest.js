process.env.NODE_ENV = 'dev';
// 'import' hoists so use 'require' so we can set NODE_ENV first.
const * as acctions = require('../tasks');

import uuid from 'uuid/v4'; // random UUID, not time-based
const newTaskID = uuid();
const newTask =
  {
    completionDate: daysAgo(3),
    description: 'TESTING: this is created by a test',
    assignedFrom: '00000000-0000-0000-0000-000000000102',
    dueDate: new Date(2017, 4, 1),
    level: 1,
  };

// Promise.all([
//   actions.getTasksIveAssigned(),
//   actions.getMyTasks(),
// ]).then(console.log).catch(console.log.bind(null, 'error'));

editTask({taskDetails: newTask}) // create a task (no taskID)
.then (task => {
  console.log(task);
})
.then(console.log).catch(console.log.bind(null, 'error'));
