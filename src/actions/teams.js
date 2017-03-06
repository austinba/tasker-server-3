import { Team, User } from '../model';
import * as userActions from './users';
import { postProcessScan, postProcessGetItems, postProcessGetItem } from './utilities';
import Promise from 'bluebird';
import R from 'ramda';

const normalize = R.evolve({
  teamdomain: R.toLower
});
const keys = R.pick(['teamdomain']);
const fields = R.pick(['teamdomain', 'teamName', 'initialUserID']);
const keysNormalized = R.pipe(keys, normalize);
const fieldsNormalized = R.pipe(fields, normalize);

export function addTeamWithInitialUser(fields) {
  fields.initialUserID = userActions.joinUserID(fields);
  return userActions.addUser(fields)  // add user BEFORE team: don't want to create a team then fail to create the initial user
    .then(
      addTeam(fields)  // yes, nested promises: only delete user if addTeam fails, not if addUser fails (would create exploitation opportunity). In the future, specific Error types will allow a filtered catch
        .catch(err => {
          userActions.deleteUser(fields)
          throw err;
        })
      );
}

export function addTeam(fields) {
  return Team.createAsync(fieldsNormalized(fields), { overwrite: false })
    .then(postProcessGetItem);
}

export function deleteTeam(fields) {
  return Team.destroyAsync(keysNormalized(fields));
}

export function getTeam(fields) {
  console.log('get team', keysNormalized(fields))
  return Team.getAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}
