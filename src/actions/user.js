import bcrypt from 'bcryptjs';
import normalizeEmail from 'normalize-email';
import jwt from 'jwt-simple';
import _ from 'underscore';
import Promise from 'bluebird';
import w from '~/helpers/winston';
import { User } from '~/model';
import { rejectIfMissingFields, dynogelsCallWith } from '~/actions/helpers';
import config from '~/../app_config.json';
import e from '~/actions/errors.js'

const JWTSecret = Buffer.from(config.jwt.secret, 'hex');
const errors = {};
errors.USER_EXISTS = 'USER_EXISTS';
errors.INVALID_TOKEN = 'INVALID_TOKEN';
errors.INVALID_PASSWORD = 'INVALID_PASSWORD';



/** Create a User
    Non-Operational Errors: MissingField, UserExists, ValidationException
*/
export function createUser(fields) {
  const requiredFields = ['username', 'teamdomain', 'email', 'password', 'firstName', 'lastName'];
  const requiredFieldsForDB = [..._.without(requiredFields, 'password'), 'passwordHash'];
  const result = Promise
    .resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeUserParameters)
    .then(ensureUserDoesntExist)
    .then(hashPassword)
    .then(dynogelsCallWith(User.createAsync, requiredFieldsForDB))
    .tap(fields => w.info(`Created user ${fields.userID} ${fields.username}@${fields.teamdomain}`));
  return result;
}

/** Create a User
    Non-Operational Errors: MissingField, ValidationException
*/
export function getUser(keys) {
  const requiredFields = ['userID'];
  const result = Promise
    .resolve(keys)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeUserParameters)
    .then(dynogelsCallWith(User.getAsync, requiredFields));
  return result;
}

/** Delete a User
    Non-Operational Errors: MissingField, ValidationException
*/
export function deleteUser(keys) {
  const requiredFields = ['userID'];
  const result = Promise
    .resolve(keys)
    .then(rejectIfMissingFields(requiredFields))
    .then(normalizeUserParameters)
    .tap(dynogelsCallWith(User.destroyAsync, requiredFields))
    .tap(fields => w.info(`Deteted user ${fields.userID}`));
  return result;
}

/** Checks the jwtToken field and applies a permission level to the user
    Non-Operational Errors: MissingField, ValidationException, InvalidToken
*/
export function authenticateUser(fields) {
  const requiredFields = ['jwtToken'];
  const result = Promise
    .resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(decodeToken)
    .then(getUser);
  return result;
}

/** Creates a token for the user and saves in as jwtToken
Non-Operational Errors: InvalidToken, MissingField, ValidationException
*/
export function createUserToken(fields) {
  const result = Promise.resolve(fields)
    .then(checkUserPassword)
    .tap(fields => {if(!fields.passwordMatches) throw errors.INVALID_PASSWORD;}) // ensure password valid
    .then(fields => _.omit(fields, 'passwordMatches'))
    .then(encodeToken);
  return result
}

/** Gets the userID based on the username and teamDomain */
export function getUserID(fields) {
  const requiredFields = ['username', 'teamDomain'];
  const result = Promise
    .resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(fields => {
      User
        .scan()
        .where('username').equals(fields.username)
        .where('teamDomain').equals(fields.teamDomain)
        .limit(1)
        .exec()
    })
}
//// TODO: Replace with a global secondary index in the future


/** Checks whether a password is correct
    adds a "passwordMatches" boolean to the returned fields.
*/
export function checkUserPassword(fields) {
  const requiredFields = ['username', 'teamDomain', 'password'];
  const result = Promise.resolve(fields)
    .then(rejectIfMissingFields(requiredFields))
    .then(getUser)
    .then(comparePasswordToHash);
  return result;
}

/** Replaces User fields with normalized versions of the same parameters */
function normalizeUserParameters(fields) {
  const normalized = {};
  if(fields.userID) normalized.userID = fields.userID.toLowerCase();
  if(fields.teamID) normalized.teamID = fields.teamID.toLowerCase();
  if(fields.email)  normalized.email  = normalizeEmail(fields.email);
  return Promise.resolve({...fields, ...normalized});
}

/** Rejects if user exists, resolves if not */
function ensureUserDoesntExist(fields) {
  const result =
  getUser(fields)
    .then(function(result) {
      if(result) return Promise.reject({...fields, error: errors.USER_EXISTS});
      return Promise.resolve(fields);
    });
  return result;
}

/** Creates a hash ("passwordHash") from the password field */
function hashPassword(fields) {
  const result = Promise.resolve(bcrypt.genSalt(10))
    .then(salt => bcrypt.hash(fields.password, salt))
    .then(passwordHash => ({ ...fields, passwordHash }))
  return result;
}

/** Returns a function that compares fields.passwordHash to the password provided */
function comparePasswordToHash(fields) {
  const result =
    Promise.resolve(bcrypt.compare(fields.password, fields.passwordHash))
      .then(isMatch => ({ ...fields, passwordMatches: isMatch }))
  return result;
}

/** Encodes a JWT token into the jwtToken field */
export function encodeToken(fields) {
  const jwtToken = 'JWT ' + jwt.encode(fields, JWTSecret);
  return {...fields, jwtToken };
}

/** Decodes the "jwtToken" field into the contained attributes
    Token is in the format "JWT token-string"
  */
export function decodeToken(fields) {
  const tokenParts = fields.jwtToken.split(' ');
  if(tokenParts.length !== 2) throw Error(errors.INVALID_TOKEN);

  const decodedFields = jwt.decode(tokenParts[1], JWTSecret);
  return {...fields, ...decodedFields};
}


// // Example usages
// createUser({userID: 'audsi', teamID: 'quarter', email: 'austin@gmail.com', password: 'hot34c2314a344kes', firstName: 'Austin', lastName: 'Baltes'})
//   .then((d) => w.debug('success', d))
//   .catch((d) => w.debug('failure', d));
//
//
// getUser({ userID: 'ausimdn',
//   teamID: 'quarter',
//   email: 'aust.in@gmail.com',
//   passwordHash: 'hot34c2314a344kes',
//   firstName: 'Austin',
//   lastName: 'Baltes' })
//   .then((d) => console.log('not', d))
//   .catch((d) => console.log(d));
