const currentUser = '00000000-0000-0000-0000-000000000101';
process.env.NODE_ENV = 'dev';

// 'import' hoists so use 'require' so we can set NODE_ENV first.
const userActions = require('../users');


// test retrieval of users
const test1 = () => Promise.all([
  userActions.getAllUsers(),
  userActions.getUsersFromIDs([
    'austin@qs',
    'chris@qs'
  ])
]).then(console.log).catch(console.log.bind(null, 'error'));

// test1();


// can create then delete a user
const test2 = () =>
  userActions.addUser({
    firstName: 'austin',
    lastName: 'baltes',
    password: 'the-best',
    teamdomain: 'qs',
    username: 'a1bman',
    email: 'aus@ba.com'})
  .then(fields => userActions.deleteUser(fields))
  .then(console.log).catch(console.log.bind(null, 'error'));

// test2();


// create a token and then authenticate with that token
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

test4();
