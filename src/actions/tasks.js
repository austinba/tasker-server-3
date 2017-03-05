import { exampleUser } from './utilities';
import R from 'ramda';
import { postProcessScan, postProcessGetItem, postProcessGetItems } from './utilities';
import { Task } from '../model';

// TODO: ensure any task modified is associated with the user
// TODO: ensure any task viewed is associated with the user's team

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

export function getTask(taskID) {
  return Task.getAsync(taskID).then(postProcessGetItem);
}

export function addTask(taskDetails) {
  const {assignedTo, assignedFrom} = taskDetails;

  // Don't dual associate task
  if( assignedTo   === exampleUser &&
      assignedFrom === exampleUser) {
    delete taskDetails['assignedFrom'];
  }

  // A new task must be associated with the current user in some way
  if( assignedTo   !== exampleUser &&
      assignedFrom !== exampleUser) {
    taskDetails['assignedTo'] = exampleUser;  // new task HAS to be associated with a user
  }

  // Task ID should be auto-generated if adding a task (allowing explicit selection could lead to vulnerabilities)
  delete taskDetails['taskID'];

  return Task.createAsync(taskDetails).then(postProcessGetItem);
}

export function editTask({taskID, taskDetails}) {
  // Check if actually adding a task
  if(taskID === 'adding-task') {
    return addTask(taskDetails);
  }

  // The task must exist if "editing" the task (otherwise, should be adding and tested aditionally)
  const updateConditions = { expected: { taskID: { Exists: true } } };  // make sure the task exists
  const {assignedTo, assignedFrom} = taskDetails;

  // Don't dual associate task
  if( assignedTo   === exampleUser &&
      assignedFrom === exampleUser) {
    delete taskDetails['assignedFrom'];
  }

  // Don't allow dual association to result from saving
  if(assignedTo === exampleUser) {
    updateConditions.expected['assignedFrom'] = { '<>': exampleUser };
  } else if(assignedFrom === exampleUser) {
    updateConditions.expected['assignedTo'] = { '<>': exampleUser };
  }

  // Don't allow non-association to result from saving
  if(assignedTo  && assignedTo  !== exampleUser) {
    updateConditions.expected['assignedFrom'] = { E: exampleUser };
  }
  if(assignedFrom && assignedFrom !== exampleUser) {
    updateConditions.expected['assignedFrom'] = { E: exampleUser };
  }
  console.log(updateConditions);

  // If editing, taskID should not be modified (could lead to vulnerabilities and bugs)
  delete taskDetails['taskID'];

  // Make the update
  return Task.updateAsync({taskID, ...taskDetails}, updateConditions).then(postProcessGetItem);
}
export function saveComment({taskID, comment}) {
  const params = {};
  params.UpdateExpression = '#comments = list_append(:comment, #comments)';
  params.ExpressionAttributeNames = {
    '#comments': 'comments'
  };
  params.ExpressionAttributeValues = {
    ':comment': comment
  };
  return Task.updateAsync(taskID, params).then(postProcessGetItem);
}


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
/** Should add a date to the list of checkins, IF one hasn't been already
    included for today */
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
