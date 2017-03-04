process.env.NODE_ENV = 'dev';

// 'import' hoists so use 'require' so we can set NODE_ENV first.
const { getAllUsers, getUsersFromIDs } = require('../users');
const testUsers = () => Promise.all([
  getAllUsers(),
  getUsersFromIDs([
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000103'
  ])
]).then(console.log).catch(console.log.bind(null, 'error'));

testUsers();
