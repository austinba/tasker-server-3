import Promise from 'bluebird';
import R from 'ramda';
import * as userActions from '../actions/users';
import * as taskActions from '../actions/tasks';

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
