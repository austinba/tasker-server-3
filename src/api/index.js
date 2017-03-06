import Promise from 'bluebird';
import R from 'ramda';
import * as userActions from '../actions/users';
import * as taskActions from '../actions/tasks';
import * as inviteActions from '../actions/invite';


export const invite              = inviteActions.invite;
export const checkIn             = taskActions.checkIn;
export const cancelCheckIn       = taskActions.undoCheckIn;
export const getMyTasks          = taskActions.getMyTasks;
export const getTasksIveAssigned = taskActions.getTasksIveAssigned;
export const editTask            = taskActions.editTask;
export const markComplete        = taskActions.markComplete;
export const markDeleted         = taskActions.markDeleted;
export const unmarkComplete      = taskActions.unmarkComplete;
export const unmarkDeleted       = taskActions.unmarkDeleted;
export const saveComment         = R.pipeP(
                                     taskActions.saveComment,
                                     R.pipe(R.prop('comments'), R.head)
                                   )
export const getUsers            = R.pipeP(
                                      userActions.getAllUsersOnUsersTeam,
                                      R.indexBy(R.prop('userID'))
                                   )
