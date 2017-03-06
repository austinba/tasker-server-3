import R from 'ramda';
import Promise from 'bluebird';
import bcrypt from 'bcryptjs'
import normalizeEmail from 'normalize-email';
import jwt from 'jwt-simple';
import { postProcessScan, postProcessGetItem } from './utilities';
import { User } from '../model';

let __JWTSecret;
if(process.env.NODE_ENV === 'dev') {
  const config = require('../app_config.json');
  __JWTSecret = Buffer.from(config.jwt.secret, 'hex');
} else {
  __JWTSecret = process.env.JWT_SECRET;
  if(!__JWTSecret) {
    throw new Error('Must set JWT secret');
  }
}
const JWTSecret = __JWTSecret;

//
// SECURITY NOTE: Only pass on password & password hash if absolutely necessary
// We don't want this to show up in a user response
//

const normalize =
  R.evolve({
    username:   R.toLower,
    teamdomain: R.toLower,
    email:      email => normalizeEmail(email)
  });
const keys = R.pick(['username', 'teamdomain']);
const tokenFields = R.pick(['username', 'teamdomain', 'password']);
const fields = R.pick(['username', 'teamdomain', 'email', 'firstName', 'lastName', 'password']);
const keysNormalized = R.pipe(keys, normalize);
const tokenFieldsNormalized = R.pipe(tokenFields, normalize);
const fieldsNormalized = R.pipe(fields, normalize);
const dropPasswordAndHash = R.pipe(R.dissoc('passwordHash'), R.dissoc('password'));
export const addUserID = user => R.assoc('userID', joinUserID(user), user);


function getAllUsers() {
  return User.scan().execAsync()
    .then(R.pipe(
      postProcessScan,
      R.map(R.pipe(
        addUserID,
        dropPasswordAndHash
      ))
    )) // add the compound userID
}

export function getAllUsersOnUsersTeam({thisUser}) {
  const {teamdomain} = thisUser;
  return (User.query(teamdomain)
    .loadAll()
    .execAsync()
    .tap(t => console.log('loaded all') || t)
    .then(R.pipe(
      postProcessScan,
      R.map(R.pipe(
        addUserID,
        dropPasswordAndHash
      ))
    )) // add the compound userID
  );
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
export function getUsersFromIDs(ids) {
  const userKeys = R.map(splitUserID, ids);
  return User.getItemsAsync(userKeys)
    .then(R.map(R.pipe(
      postProcessGetItem,
      dropPasswordAndHash
    )));
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
export function getUserAndPass(fields) {
  return User.getAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}
export function getUser(fields) {
  return getUserAndPass(fields).then(dropPasswordAndHash);
}
export function deleteUser(fields) {
  return User.destroyAsync(keysNormalized(fields));
}
export function checkUserPassword({password, ...fields}) {
  return getUserAndPass(keysNormalized(fields))
    .then(comparePasswordToHash(password));
}
/** Authenticates a user from a JWT token and returns the user object */
export function login(fields) {
  return checkUserPassword(fields)
    .then(R.pipe(
      R.unless(R.prop('isMatch'), R.always({})),
      R.omit('isMatch'),
      R.unless(
        R.isEmpty,
        R.merge(encodeToken(tokenFieldsNormalized(fields)))
      ),
      dropPasswordAndHash
    ))
}
/** Authenticates a user from a JWT token and returns the user object */
export function authenticate({jwtToken}) {
  const fields = decodeToken(jwtToken);
  return checkUserPassword(fields)
    .then(R.pipe(
      R.unless(R.prop('isMatch'), R.always({})),
      R.omit('isMatch')
    ))
    .then(dropPasswordAndHash);
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
  return (fields) => {
    return bcrypt.compare(password, fields.passwordHash)
      .then(R.assoc('isMatch', R.__, fields))
  }
}
/** Encodes a JWT token embedded the supplied fields */
export function encodeToken(fields) {
  return {jwtToken: ('JWT ' + jwt.encode(fields, JWTSecret))};
}
/** Decodes the "jwtToken" field into the contained attributes
    Token is in the format "JWT [token-string]" */
function decodeToken(jwtToken) {
  const tokenParts = (jwtToken || '').split(' ');
  if(tokenParts.length !== 2) throw new Error('Invalid Token');
  return jwt.decode(tokenParts[1], JWTSecret);
}
