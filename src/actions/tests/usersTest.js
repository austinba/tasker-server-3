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


// can create a user
const test2 = () =>
  userActions.addUser({
    firstName: 'austin',
    lastName: 'baltes',
    password: 'the-best',
    teamdomain: 'qs',
    username: 'a8bman',
    email: 'aus@ba.com'})
    .then(console.log).catch(console.log.bind(null, 'error'));

test2();
