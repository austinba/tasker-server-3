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
