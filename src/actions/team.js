import _ from 'underscore';
import Promise from 'bluebird';
import w from '~/helpers/winston';
import { Team, User } from '~/model';
import { createUser } from '~/actions/user';
import { rejectIfMissingFields, dynogelsCallWith } from '~/actions/helpers';

const errors = {};
errors.TEAM_EXISTS = 'TEAM_EXISTS';


/** Create a Team with an Initial User */
export function createTeamWithInitialUser(fields) {
  // Create user before team: If failure, easier to deal with a rogue username
  // than a rogue teamname.
  // Need to test for teamID and teamName, because we do not want to create a
  // user and then have insufficient fields for the team
  // However must not create a user on an already existing team
  const requiredFields = ['teamID', 'teamName'];
  const result = Promise
    .resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeTeamParameters)
    .then(ensureTeamDoesntExist) // critical to not allow user creation on an existing team
    .then(createUser)
    .then(createTeam)
  return result;
}

/** Create a Team
    Non-Operational Errors: MissingField, TeamExists, ValidationException
*/
export function createTeam(fields) {
  const requiredFields = ['teamID', 'teamName'];
  const result = Promise
    .resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeTeamParameters)
    .then(ensureTeamDoesntExist)
    .then(dynogelsCallWith(Team.createAsync, requiredFields))
    .tap(fields => w.info(`Created team ${fields.teamID}`))
  return result;
}

/** Create a Team
    Non-Operational Errors: MissingField, ValidationException
*/
export function getTeam(keys) {
  const requiredFields = ['teamID'];
  const result = Promise
    .resolve(keys)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeTeamParameters)
    .then(dynogelsCallWith(Team.getAsync, requiredFields))
  return result;
}

/** Delete a Team
    Non-Operational Errors: MissingField, ValidationException
*/
export function deleteTeam(keys) {
  const requiredFields = ['teamID'];
  const result = Promise
    .resolve(keys)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeTeamParameters)
    .tap(dynogelsCallWith(Team.destroyAsync, requiredFields))
    .tap(fields => w.info(`Deleted team ${fields.teamID}`));
  return result;
}

/** Replaces User fields with normalized versions of the same parameters */
export function normalizeTeamParameters(fields) {
  const normalized = {};
  if(fields.teamID) normalized.teamID = fields.teamID.toLowerCase();
  return Promise.resolve({...fields, ...normalized});
}

/** Rejects if user exists, resolves if not */
function ensureTeamDoesntExist(fields) {
  const result =
  getTeam(fields)
    .then(function(result) {
      if(result) return Promise.reject({...fields, error: errors.TEAM_EXISTS });
      return Promise.resolve(fields);
    });
  return result;
}
