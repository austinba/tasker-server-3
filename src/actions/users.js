import R from 'ramda';
import { User } from '../model';
import Promise from 'bluebird';

export function getAllUsers() {
  return User.scan().execAsync().then(R.pipe(
    R.prop('Items'),
    R.map(R.prop('attrs'))
  ));
}
export function getUsersFromIDs(ids) {
  return User.getItemsAsync(ids).then(R.map(R.prop('attrs')));
}
