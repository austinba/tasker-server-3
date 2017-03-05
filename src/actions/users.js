import R from 'ramda';
import Promise from 'bluebird';
import { postProcessScan, postProcessGetItems } from './utilities';
import { User } from '../model';

export function getAllUsers() {
  return User.scan().execAsync().then(postProcessScan);
}
export const getUsers = getAllUsers; // alias
export function getUsersFromIDs(ids) {
  return User.getItemsAsync(ids).then(postProcessGetItems);
}
