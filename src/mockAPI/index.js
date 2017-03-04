import { tasks, users, checkIns } from './mockData';
import Promise from 'bluebird';
import R from 'ramda';

const user = 101;
const getTaskIndex = (taskID) => R.findIndex(R.propEq('taskID', taskID))(tasks);
// R.whereEq({
//   assignedTo: userID
// });

export function checkIn(taskID) {
  const now = new Date();
  const taskCheckIns = checkIns[taskID];
  if(!taskCheckIns) {
    checkIns[taskID] = [now];
    return Promise.resolve(now).delay(500);
  }
  const mostRecent = taskCheckIns[0];
  const mostRecentDateString = new Date(mostRecent || 0).toJSON().split('T')[0];
  const nowDateString = now.toJSON().split('T')[0];
  if(nowDateString === mostRecentDateString) {
    delete taskCheckIns[0];
  }
  taskCheckIns.unshift(now);
  return Promise.resolve(now).delay(500);
}

export function cancelCheckIn(taskID) {
  const now = new Date();
  const taskCheckIns = checkIns[taskID];
  if(!taskCheckIns) {
    checkIns[taskID] = [now];
    return Promise.resolve(0).delay(500);
  }
  const mostRecent = taskCheckIns[0];
  const mostRecentDateString = new Date(mostRecent || 0).toJSON().split('T')[0];
  const nowDateString = now.toJSON().split('T')[0];
  if(nowDateString === mostRecentDateString) {
    delete taskCheckIns[0];
  }
  return Promise.resolve(taskCheckIns[0] || 0).delay(500);

}

export function getMyTasks() {
  return Promise.resolve({
    tasks: R.pipe(
      R.filter(task => task.assignedTo === user),
      R.map(task =>
        R.assoc( 'lastCheckIn',
                 R.reduce(R.max, 0, R.defaultTo([], checkIns[task.taskID])),
                  task)
      ),
      R.map(R.evolve({ comments: R.sortWith([R.descend(R.prop('date'))]) })),
      R.indexBy(R.prop('taskID')),
      R.clone
    )(tasks),

    users: R.pipe(
      R.filter(task => task.assignedTo === user),
      R.map(task => [ task.assignedTo,
                      task.assignedFrom,
                      R.map(comment => comment.from)(task.comments)]),
      R.flatten,
      R.reject(R.isNil),
      R.dropRepeats,
      R.map(userID => R.find(R.propEq('userID', userID))(users)),
      R.indexBy(R.prop('userID')),
      R.clone
    )(tasks)
  }).delay(500);
}
export function getTasksIveAssigned() {
  return Promise.resolve({
    tasks: R.pipe(
      R.filter(task => task.assignedFrom === user),
      R.map(task =>
        R.assoc( 'lastCheckIn',
                 R.reduce(R.max, 0, R.defaultTo([], checkIns[task.taskID])),
                  task)
      ),
      R.indexBy(R.prop('taskID')),
      R.clone
      )(tasks),
    users: R.pipe(
      R.filter(task => task.assignedFrom === user),
      R.map(task => [ task.assignedTo,
                      task.assignedFrom,
                      R.map(comment => comment.from)(task.comments)]),
      R.flatten,
      R.reject(R.isNil),
      R.dropRepeats,
      R.map(userID => R.find(R.propEq('userID', userID))(users)),
      R.indexBy(R.prop('userID')),
      R.clone
    )(tasks)
  }).delay(500);
}
export function addTask({description, assignedTo, assignedFrom, level, dueDate}) {
  const newTask = {
    taskID: Math.floor(Math.random() * 100000),
    assignedTo,
    assignedFrom,
    level,
    dueDate
  }
  tasks.push(newTask);
  return Promise.resolve(R.clone(newTask)).delay(500);
}
export function editTask(taskID, taskDetails) {
  let task;
  if(taskID === 'adding-task') {
    task = {};
    tasks.push(task);
    task.taskID =  Math.floor(Math.random() * 100000);
  } else {
    const taskIndex = R.findIndex(R.propEq('taskID', taskID))(tasks);
    if(!taskIndex === -1) {
      return Promise.reject().delay(500)
    };
    task = tasks[taskIndex];
  }
  // actually mutate 'task' -- it's our pseudo database in this mock api
  R.forEachObjIndexed((value, key) => task[key] = value)(taskDetails)
  // if(description) task.description = taskDetails.description;
  // if(assignedTo) task.assignedTo = taskDetails.assignedTo;
  // if(assignedFrom) task.assignedFrom = taskDetails.assignedFrom;
  // if(level) task.level = taskDetails.level;
  // if(dueDate) task.dueDate = taskDetails.dueDate;
  return Promise.resolve(R.clone(task)).delay(500);
}
export function saveComment(taskID, comment) {
  const taskIndex = R.findIndex(R.propEq('taskID', taskID))(tasks);
  if(!taskIndex === -1) {
    return Promise.reject().delay(500)
  };
  const newComment = {
    commentID: Math.floor(Math.random() * 100000),
    from: user,
    date: Date.now(),
    comment
  }
  tasks[taskIndex].comments.push(newComment);
  return Promise.resolve(R.clone(newComment)).delay(500);
}
export function getUsers() {
  return Promise.resolve(users).then(R.indexBy(R.prop('userID'))).delay(500);
}
export function markComplete(taskID) {
  const taskIndex = getTaskIndex(taskID);
  if(taskIndex === -1) return Promise.reject();

  tasks[taskIndex] = R.assoc('dateCompleted', new Date())(tasks[taskIndex])
  return Promise.resolve(tasks[taskIndex]).delay(500);
}

export function markDeleted(taskID) {
  const taskIndex = getTaskIndex(taskID);
  if(taskIndex === -1) return Promise.reject();

  tasks[taskIndex] = R.assoc('dateDeleted', new Date())(tasks[taskIndex])
  return Promise.resolve(tasks[taskIndex]).delay(500);
}

export function unmarkComplete(taskID) {
  const taskIndex = getTaskIndex(taskID);
  if(taskIndex === -1) return Promise.reject();

  tasks[taskIndex] = R.dissoc('dateCompleted')(tasks[taskIndex])
  return Promise.resolve(tasks[taskIndex]).delay(500);
}
export function unmarkDeleted(taskID) {
  const taskIndex = getTaskIndex(taskID);
  if(taskIndex === -1) return Promise.reject();

  tasks[taskIndex] = R.dissoc('dateDeleted')(tasks[taskIndex])
  return Promise.resolve(tasks[taskIndex]).delay(500);
}
