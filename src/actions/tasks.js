import { exampleUser } from './utilities';
import R from 'ramda';
import { postProcessScan, postProcessGetItem, postProcessGetItems } from './utilities';
import { Task } from '../model';
import * as userActions from './users';

// TODO: ensure any task modified is associated with the user
// TODO: ensure any task viewed is associated with the user's team

const getRecentUserIDs =
  R.pipe(
    R.filter(task => task.assignedTo === exampleUser),
    R.map(task => [ task.assignedTo,
                    task.assignedFrom,
                    R.map(comment => comment.from)(task.comments || [])]),
    R.flatten,
    R.reject(R.isNil),
    R.dropRepeats
  );

function postProcessTaskList(dbPromise) {
  return Promise.resolve(dbPromise)
    .then(postProcessScan)
    .then(  // process checkIn
      R.map(
        R.pipe(
          R.converge(
            R.assoc,
            [ R.always('lastCheckInDate'),
              R.pipe(R.prop('checkIns'), R.defaultTo([]), R.head, R.defaultTo(0)),
              R.identity
            ]
          ),
          R.omit('checkIns')
        )))
    .then(
      tasklist => ({
        tasks: R.pipe( // sort comments and index tasks
                 R.map(R.evolve({ comments: R.sortWith([R.descend(R.prop('date'))]) })),
                 R.indexBy(R.prop('taskID')))(tasklist),
        users: getRecentUserIDs(tasklist)
    }))
}
export function getMyTasks() {
  return Task
    .scan()
    .where('assignedTo').equals(exampleUser)
    .execAsync()
    .then(postProcessTaskList)
}

export function getTasksIveAssigned() {
  return Task
    .scan()
    .where('assignedFrom').equals(exampleUser)
    .execAsync()
    .then(postProcessTaskList)
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

  // if something is being assigned
  if(assignedTo || assignedFrom) {
    // and the other isn't assigned to the current user,
    // make sure the current user is already assigned to the other
    if(!assignedTo && (assignedFrom !== exampleUser)) {
      updateConditions.expected['assignedTo'] = { E: exampleUser };
    }
    if(!assignedFrom && (assignedTo !== exampleUser)) {
      updateConditions.expected['assignedFrom'] = { E: exampleUser };
    }
  }

  // If editing, taskID should not be modified (could lead to vulnerabilities and bugs)
  delete taskDetails['taskID'];

  // Make the update
  return Task.updateAsync({taskID, ...taskDetails}, updateConditions).then(postProcessGetItem);
}
export function saveComment({taskID, comment}) {
  const params = {};
  const commentObj = {
    from: exampleUser,
    date: new Date().toJSON(),
    comment
  }
  params.UpdateExpression =
    'SET #comments = list_append (:comment, if_not_exists(#comments, :empty_list))';
  params.ExpressionAttributeNames = {
    '#comments': 'comments'
  };
  params.ExpressionAttributeValues = {
    ':empty_list': [],
    ':comment': [commentObj]
  };
  return Task.updateAsync({taskID}, params).then(postProcessGetItem).catch(console.log);
}

export function checkIn({taskID}) {
  const params = {};
  const newDateString = new Date().toJSON();
  const justDatePart = newDateString.split('T')[0];
  params.ExpressionAttributeNames = {
    '#checkIns': 'checkIns'
  };
  params.ExpressionAttributeValues = {
    ':newCheckIn': [newDateString],
    ':justDatePart': justDatePart,
    ':empty_list': []
  };
  params.UpdateExpression = 'SET #checkIns = list_append(:newCheckIn, if_not_exists(#checkIns, :empty_list))';
  // make sure task is not already checked in today
  params.ConditionExpression = 'attribute_not_exists(#checkIns) OR (NOT begins_with(#checkIns[0], :justDatePart))';

  return Task.updateAsync({taskID}, params).then(postProcessGetItem);
}

export function undoCheckIn({taskID}) {
  const params = {};
  const newDateString = new Date().toJSON();
  const justDatePart = newDateString.split('T')[0];
  params.UpdateExpression = '#checkIns = REMOVE #checkIns[0]';
  params.ExpressionAttributeNames = {
    '#checkIns': 'checkIns'
  };
  params.ExpressionAttributeValues = {
    ':justDatePart': justDatePart,
  };
  // make sure task is not already checked in today
  params.ConditionExpression = 'attribute_exists(#checkIns) AND (begins_with(#checkIns[0], :justDatePart))';

  return Task.updateAsync({taskID}, params).then(postProcessGetItem);

}

export function markComplete({taskID}) {
  return updateTask({taskID}, {completionDate: new Date().toJSON()});
}

export function markDeleted({taskID}) {
  return updateTask({taskID}, {deleteDate: new Date().toJSON()});
}

export function unmarkComplete({taskID}) {
  return updateTask({taskID}, {completionDate: null});
}

export function unmarkDeleted({taskID}) {
  return updateTask({taskID}, {deleteDate: null});
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
