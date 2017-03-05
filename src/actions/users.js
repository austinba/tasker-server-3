import R from 'ramda';
import Promise from 'bluebird';
import normalizeEmail from 'normalize-email';
import { postProcessScan, postProcessGetItems, postProcessGetItem } from './utilities';
import { User } from '../model';
import config from '../app_config.json';
const JWTSecret = Buffer.from(config.jwt.secret, 'hex');

/** Replaces User fields with normalized versions of the same parameters */
const normalize =
R.evolve({
  username:   R.toLower,
  teamDomain: R.toLower,
  email:      R.apply(normalizeEmail)
});

const keys = R.pick('username', 'teamDomain');
const keysNormalized = R.pipe(keys, normalizeUserAttrs);

/** Create a User */
export function add(fields) {
  return hashPassword(normalize(fields))
    .then(fields => User.createAsync(fields, { overwrite: false }))
    .then(postProcessGetItem);
}

/** Get a user */
export function fetch(fields) {
  return User.getItemAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}

/** Delete a User */
export function deleteUser(fields) {
  return User.destoryAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}

/** Authenticates a user from a JWT token and returns the user object */
export function authenticateUser(token) {
  const fields = decodeToken(token);
  return getUser(fields)
}

/** Checks whether a password is correct */
export function checkUserPassword({password, ...fields}) {
  return getUser(keysNormalized(fields))
    .then(comparePasswordToHash(password)); // returns error if fails
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
  return (fields) => bcrypt.compare(password, fields.passwordHash));
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
    console.log('failed to decode token:', error);
    return {};
  }
}

export function getAllUsers() {
  return User.scan().execAsync().then(postProcessScan);
}
export function getUsersFromIDs(ids) {
  return User.getItemsAsync(ids).then(postProcessGetItems);
}
