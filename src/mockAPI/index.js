import { tasks, users, checkIns } from './mockData';
import Promise from 'bluebird';
import R from 'ramda';
import * as userActions from '../actions/users';
import * as taskActions from '../actions/tasks';

const user = 101;
const getTaskIndex = (taskID) => R.findIndex(R.propEq('taskID', taskID))(tasks);
// R.whereEq({
//   assignedTo: userID
// });

export function checkIn({taskID}) {
  return taskActions.checkIn({taskID})
}

export function cancelCheckIn({taskID}) {
  return taskActions.undoCheckIn({taskID})
}

export function getMyTasks() {
  return taskActions.getMyTasks();
}
export function getTasksIveAssigned() {
  return taskActions.getTasksIveAssigned()//.then(R.indexBy(R.prop('taskID')));
}
export function editTask({taskID, taskDetails}) {
  return taskActions.editTask({taskID, taskDetails});
}
export function saveComment({taskID, comment}) {
  return taskActions.saveComment({taskID, comment}).then(
    R.pipe(R.prop('comments'), R.head)
  )
}
export function getUsers() {
  return userActions.getAllUsers().then(R.indexBy(R.prop('userID')));
}
export function markComplete({taskID}) {
  return taskActions.markComplete({taskID});
}

export function markDeleted({taskID}) {
  return taskActions.markDeleted({taskID});
}

export function unmarkComplete({taskID}) {
  return taskActions.unmarkComplete({taskID});
}
export function unmarkDeleted({taskID}) {
  return taskActions.unmarkDeleted({taskID});
}
//
//
//
// import { tasks, users, checkIns } from './mockData';
// import Promise from 'bluebird';
// import R from 'ramda';
//
// const user = 101;
// const getTaskIndex = (taskID) => R.findIndex(R.propEq('taskID', taskID))(tasks);
// // R.whereEq({
// //   assignedTo: userID
// // });
//
// export function checkIn({taskID}) {
//   const now = new Date();
//   const taskCheckIns = checkIns[taskID];
//   if(!taskCheckIns) {
//     checkIns[taskID] = [now];
//     return Promise.resolve(now);
//   }
//   const mostRecent = taskCheckIns[0];
//   const mostRecentDateString = new Date(mostRecent || 0).toJSON().split('T')[0];
//   const nowDateString = now.toJSON().split('T')[0];
//   if(nowDateString === mostRecentDateString) {
//     delete taskCheckIns[0];
//   }
//   taskCheckIns.unshift(now);
//   return Promise.resolve({date: now});
// }
//
// export function cancelCheckIn({taskID}) {
//   const now = new Date();
//   const taskCheckIns = checkIns[taskID];
//   if(!taskCheckIns) {
//     checkIns[taskID] = [now];
//     return Promise.resolve(0);
//   }
//   const mostRecent = taskCheckIns[0];
//   const mostRecentDateString = new Date(mostRecent || 0).toJSON().split('T')[0];
//   const nowDateString = now.toJSON().split('T')[0];
//   if(nowDateString === mostRecentDateString) {
//     delete taskCheckIns[0];
//   }
//   return Promise.resolve({date: taskCheckIns[0] || 0});
//
// }
//
// export function getMyTasks2() {
//   return Promise.resolve({
//     tasks: R.pipe(
//       R.filter(task => task.assignedTo === user),
//       R.map(task =>
//         R.assoc( 'lastCheckInDate',
//                  R.reduce(R.max, 0, R.defaultTo([], checkIns[task.taskID])),
//                   task)
//       ),
//       R.map(R.evolve({ comments: R.sortWith([R.descend(R.prop('date'))]) })),
//       R.indexBy(R.prop('taskID')),
//       R.clone
//     )(tasks),
//
//     users: R.pipe(
//       R.filter(task => task.assignedTo === user),
//       R.map(task => [ task.assignedTo,
//                       task.assignedFrom,
//                       R.map(comment => comment.from)(task.comments)]),
//       R.flatten,
//       R.reject(R.isNil),
//       R.dropRepeats,
//       R.map(userID => R.find(R.propEq('userID', userID))(users)),
//       R.indexBy(R.prop('userID')),
//       R.clone
//     )(tasks)
//   });
// }
// export function getTasksIveAssigned() {
//   return Promise.resolve({
//     tasks: R.pipe(
//       R.filter(task => task.assignedFrom === user),
//       R.map(task =>
//         R.assoc( 'lastCheckInDate',
//                  R.reduce(R.max, 0, R.defaultTo([], checkIns[task.taskID])),
//                   task)
//       ),
//       R.indexBy(R.prop('taskID')),
//       R.clone
//       )(tasks),
//     users: R.pipe(
//       R.filter(task => task.assignedFrom === user),
//       R.map(task => [ task.assignedTo,
//                       task.assignedFrom,
//                       R.map(comment => comment.from)(task.comments)]),
//       R.flatten,
//       R.reject(R.isNil),
//       R.dropRepeats,
//       R.map(userID => R.find(R.propEq('userID', userID))(users)),
//       R.indexBy(R.prop('userID')),
//       R.clone
//     )(tasks)
//   });
// }
// export function addTask({description, assignedTo, assignedFrom, level, dueDate}) {
//   const newTask = {
//     taskID: Math.floor(Math.random() * 100000),
//     assignedTo,
//     assignedFrom,
//     level,
//     dueDate
//   }
//   tasks.push(newTask);
//   return Promise.resolve(R.clone(newTask));
// }
// export function editTask({taskID, taskDetails}) {
//   let task;
//   if(taskID === 'adding-task') {
//     task = {};
//     tasks.push(task);
//     task.taskID =  Math.floor(Math.random() * 100000);
//   } else {
//     const taskIndex = R.findIndex(R.propEq('taskID', taskID))(tasks);
//     if(!taskIndex === -1) {
//       return Promise.reject()
//     };
//     task = tasks[taskIndex];
//   }
//   // actually mutate 'task' -- it's our pseudo database in this mock api
//   R.forEachObjIndexed((value, key) => task[key] = value)(taskDetails)
//   // if(description) task.description = taskDetails.description;
//   // if(assignedTo) task.assignedTo = taskDetails.assignedTo;
//   // if(assignedFrom) task.assignedFrom = taskDetails.assignedFrom;
//   // if(level) task.level = taskDetails.level;
//   // if(dueDate) task.dueDate = taskDetails.dueDate;
//   return Promise.resolve(R.clone(task));
// }
// export function saveComment({taskID, comment}) {
//   const taskIndex = R.findIndex(R.propEq('taskID', taskID))(tasks);
//   if(!taskIndex === -1) {
//     return Promise.reject()
//   };
//   const newComment = {
//     commentID: Math.floor(Math.random() * 100000),
//     from: user,
//     date: Date.now(),
//     comment
//   }
//   tasks[taskIndex].comments.push(newComment);
//   return Promise.resolve(R.clone(newComment));
// }
// export function getUsers() {
//   return Promise.resolve(users).then(R.indexBy(R.prop('userID')));
// }
// export function markComplete({taskID}) {
//   const taskIndex = getTaskIndex(taskID);
//   if(taskIndex === -1) return Promise.reject();
//
//   tasks[taskIndex] = R.assoc('completionDate', new Date())(tasks[taskIndex])
//   console.log(tasks[taskIndex])
//   return Promise.resolve(tasks[taskIndex]);
// }
//
// export function markDeleted({taskID}) {
//   const taskIndex = getTaskIndex(taskID);
//   if(taskIndex === -1) return Promise.reject();
//
//   tasks[taskIndex] = R.assoc('deleteDate', new Date())(tasks[taskIndex])
//   return Promise.resolve(tasks[taskIndex]);
// }
//
// export function unmarkComplete({taskID}) {
//   const taskIndex = getTaskIndex(taskID);
//   if(taskIndex === -1) return Promise.reject();
//
//   tasks[taskIndex] = R.dissoc('completionDate')(tasks[taskIndex])
//   return Promise.resolve(tasks[taskIndex]);
// }
// export function unmarkDeleted({taskID}) {
//   const taskIndex = getTaskIndex(taskID);
//   if(taskIndex === -1) return Promise.reject();
//
//   tasks[taskIndex] = R.dissoc('deleteDate')(tasks[taskIndex])
//   return Promise.resolve(tasks[taskIndex]);
// }
