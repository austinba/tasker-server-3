process.env.NODE_ENV = 'dev';

// 'import' hoists so use 'require' so we can set NODE_ENV first.
const teamActions = require('../teams');
const userActions = require('../users');
import R from 'ramda';

// test the retreival of a single team
const test0 = () =>
  teamActions.getTeam({teamdomain: 'qs'})
    .then(console.log).catch(console.log.bind(null, 'error'));

// test0();

// test the retrieval of a non-existant team (should return an empty object)
const test1 = () =>
  teamActions.getTeam({teamdomain: 'notateam'})
    .then(console.log).catch(console.log.bind(null, 'error'));

// test1();

// add a team then delete that same team (TODO: in the future this should also delete all associated users, and probably just "mark the teamdomain" as deleted)
const test2 = () => {
  const fields = {
    teamdomain: 'bestteamever',
    teamName: 'Best Team Ever',
    initialUserID: 'bestpersonever@bestteamever',
  };
  teamActions.addTeam(fields)
  .then(t=>console.log('intermediate result', t) || t)
  .catch(t=>console.log('intermediate failure', t) || t)
  .then(teamActions.deleteTeam(fields))
  .then(console.log.bind(null, 'successful delete'))
  .catch(console.log.bind(null, 'error deleting'));
}

// test2();


// add a team with an intial user, then delete that user and team
const test3 = () => {
  const fields = {
    username: 'bestpersonever',
    teamdomain: 'bestteamever',
    teamName: 'Best Team Ever',
    firstName: 'Best',
    lastName: 'Man',
    password: 'mysecurepassword',
    email: 'thegreatestemailever@awesomedomain.com'
  }
  teamActions.addTeamWithInitialUser(fields)
  .then(t=>console.log('\n\n\nadd team and user result\n', t) || t)
  .catch(t=>console.log('\n\n\nadd team and user failure\n', t) || t)
  .then(() => userActions.login(fields))
  .then(t=>console.log('\n\n\nlogin result\n', t) || t)
  .catch(t=>console.log('\n\n\nlogin failure\n', t) || t)
  .then(userActions.authenticate) // auth using token
  .then(t=>console.log('\n\n\nlogin result\n', t) || t)
  .catch(t=>console.log('\n\n\nlogin failure\n', t) || t)
  .then(() => userActions.deleteUser(fields))
  .then(t=>console.log('\n\n\ndelete user result\n', t) || t)
  .catch(t=>console.log('\n\n\ndelete user failure\n', t) || t)
  .then(() => teamActions.deleteTeam(fields))
  .then(t=>console.log('\n\n\ndelete team result\n', t) || t)
  .catch(t=>console.log('\n\n\ndelete team failure\n', t) || t)
}

test3()
