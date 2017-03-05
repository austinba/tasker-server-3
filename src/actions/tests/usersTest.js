process.env.NODE_ENV = 'dev';

// 'import' hoists so use 'require' so we can set NODE_ENV first.
const userActions = require('../users');


// test retrieval of single user
const test10 = () =>
  userActions.getUser({username: 'austin', teamdomain: 'qs'})
    .then(console.log).catch(console.log.bind(null, 'error'));

// test10();

// test retrieval of non-existant user (should return empty object)
const test11 = () =>
  userActions.getUser({username: 'austin', teamdomain: 'notateam'})
    .then(console.log).catch(console.log.bind(null, 'error'));

// test11();

// test retrieval of multiple users
const test1 = () =>
  userActions.getUsersFromIDs([
    'austin@qs',
    'chris@qs'
  ])
  .then(console.log).catch(console.log.bind(null, 'error'));

test1();

// test retrieval of all users
const test12 = () =>
  userActions.getAllUsers()
  .then(console.log).catch(console.log.bind(null, 'error'));

// test12();


// can create then delete a user
// ensure password / hash are not present if intermediate object
const test2 = () => {
  const fields = {
    firstName: 'austin',
    lastName: 'baltes',
    password: 'the-best',
    teamdomain: 'qs',
    username: 'a1bman',
    email: 'aus@ba.com'};
  userActions.addUser(fields )
  .then(t=>console.log('intermediate result', t) || t)
  .catch(t=>console.log('intermediate failure', t) || t)
  .then(userActions.deleteUser(fields))
  .then(console.log).catch(console.log.bind(null, 'error'));
}
// test2();


// create a token and then authenticate with that token
// ensure password / hash are not present if resulting object
const test3 = () => Promise.resolve(
  userActions.encodeToken({
    password: 'the-best',
    teamdomain: 'qs',
    username: 'a1bman'
  }))
  .then(userActions.authenticateUser)
  .then(console.log).catch(console.log.bind(null, 'error'));

// test3();


// create a token and then try to authenticate and fail with wrong pass
const test4 = () => Promise.resolve(
  userActions.encodeToken({
    password: 'wrongpassword',
    teamdomain: 'qs',
    username: 'a1bman'
  }))
  .then(userActions.authenticateUser)
  .then(console.log).catch(console.log.bind(null, 'error'));

// test4();
