import R from 'ramda';
import Promise from 'bluebird';
import bcrypt from 'bcryptjs'
import normalizeEmail from 'normalize-email';
import { postProcessScan, postProcessGetItems, postProcessGetItem } from './utilities';
import { User } from '../model';
import config from '../app_config.json';
const JWTSecret = Buffer.from(config.jwt.secret, 'hex');

//
// SECURITY NOTE: Only pass on password & password hash if absolutely necessary
// We don't want this to show up in a user response
//

/** Replaces User fields with normalized versions of the same parameters */
const normalize =
  R.evolve({
    username:   R.toLower,
    teamdomain: R.toLower,
    email:      email => normalizeEmail(email)
  });
const keys = R.pick(['username', 'teamdomain']);
const fields = R.pick(['username', 'teamdomain', 'email', 'firstName', 'lastName', 'password']);
const keysNormalized = R.pipe(keys, normalize);
const fieldsNormalized = R.pipe(fields, normalize);
const addUserID = user => R.assoc('userID', joinUserID(user), user);
const dropPasswordAndHash = R.pipe(R.dissoc('passwordHash'), R.dissoc('password'));


export function getAllUsers() {
  return User.scan().execAsync()
    .then(R.pipe(
      postProcessScan,
      R.map(R.pipe(
        addUserID,
        dropPasswordHash
      ))
    )) // add the compound userID
}
/** username@teamdomain => {username, teamdomain}*/
export function splitUserID(userID) {
  const splitUserID = userID.split('@');
  if(splitUserID.length !== 2) return {};
  return { username: splitUserID[0], teamdomain: splitUserID[1] };
}
/** {username, teamdomain} => username@teamdomain */
export function joinUserID({username, teamdomain}) {
  if(!username || !teamdomain) return '';
  return username + '@' + teamdomain;
}
// this is going to go away -- but needed for mock data
export function getUsersFromIDs(ids) {
  return User.getItemsAsync(R.map(splitUserID)(ids))
    .then(postProcessGetItems);
}
export function addUser(fields) {
  return hashPassword(fieldsNormalized(fields))
    .then(R.omit('password')) // don't send to db, now that it is converted to a hash
    .then(fields => User.createAsync(fields, { overwrite: false }))
    .then(R.pipe(
        postProcessGetItem,
        dropPasswordAndHash
      ));
}
export function getUser(fields) {
  return User.getItemAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}
export function deleteUser(fields) {
  return User.destoryAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}
export function checkUserPassword({password, ...fields}) {
  return getUser(keysNormalized(fields))
  .then(comparePasswordToHash(password)); // returns error if fails
}
/** Authenticates a user from a JWT token and returns the user object */
export function authenticateUser(token) {
  const fields = decodeToken(token);
  return getUser(fields)
}
/** Creates a hash ("passwordHash") from the password field */
function hashPassword(fields) {
  const result = Promise.resolve(bcrypt.genSalt(10))
    .then(salt => bcrypt.hash(fields.password, salt))
    .then(passwordHash => ({ ...fields, passwordHash }))
  return result;
}
/** Returns a function that compares fields.passwordHash to the password provided */
function comparePasswordToHash(password) {
  return (fields) => bcrypt.compare(password, fields.passwordHash);
}
/** Encodes a JWT token embedded the supplied fields */
export function encodeToken(fields) {
  return 'JWT ' + jwt.encode(JWTSecret);
}
/** Decodes the "jwtToken" field into the contained attributes
    Token is in the format "JWT [token-string]" */
function decodeToken(fields) {
  try {
    const tokenParts = (fields.jwtToken || '').split(' ');
    if(tokenParts.length !== 2) throw Error('Invalid Token');
    return jwt.decode(tokenParts[1], JWTSecret);
  } catch (error) {
    return {};
  }
}
