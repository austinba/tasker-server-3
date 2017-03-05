import { exampleUser } from './utilities';
import R from 'ramda';
import { postProcessScan } from './utilities';
import { Task } from '../model';

export function getMyTasks() {
  return Task
    .scan()
    .where('assignedTo').equals(exampleUser)
    .execAsync().then(postProcessScan);
}

export function getTasksIveAssigned() {
  return Task
    .scan()
    .where('assignedFrom').equals(exampleUser)
    .execAsync().then(postProcessScan);
}

export function addTask(taskDetails) {
  // Don't dual associate task
  if( taskDetails.assignedTo   === exampleUser &&
      taskDetails.assignedFrom === exampleUser) {
    delete taskDetails.assignedFrom;
  }

  // A new task must be associated with the current user in some way
  if( taskDetails.assignedTo   !== exampleUser &&
      taskDetails.assignedFrom !== exampleUser) {
    taskDetails.assignedTo = exampleUser;  // new task HAS to be associated with a user
  }

  // Task ID should be auto-generated if adding a task (allowing explicit selection could lead to vulnerabilities)
  delete taskDetails['taskID'];

  return Task.create(taskDetails);
}

export function editTask({taskID, taskDetails}) {
  // Check if actually adding a task
  if(taskID === 'adding-task') {
    return addTask(taskDetails);
  }

  // Don't dual associate task
  if( taskDetails.assignedTo   === exampleUser &&
      taskDetails.assignedFrom === exampleUser) {
    delete taskDetails.assignedFrom;
  }

  // The task must exist if "editing" the task (otherwise, should be adding and tested aditionally)
  const updateConditions = { expected: { taskID: { Exists: true } } };  // make sure the task exists

  // Don't allow dual association to result from saving
  if(taskDetails.assignedTo === exampleUser) {  // ensure assignedTo wont equal assignedFrom upon saving
    updateConditions.expected['assignedFrom'] = { NE: exampleUser };
  } else if (taskDetails.assignedFrom === exampleUser) {
    updateConditions.expected['assignedTo'] = { NE: exampleUser };
  }

  // If editing, taskID should not be modified (could lead to vulnerabilities and bugs)
  delete taskDetails['taskID'];

  // Make the update
  return Task.updateAsync(taskDetails, updateConditions);
}

export function checkIn({taskID}) {

}
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
