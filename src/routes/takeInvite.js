import * as inviteActions from '../actions/invite';
import * as userActions from '../actions/users';
import express from 'express';
const router = express.Router();

router.get('/doesUserExist', (req, res) => {
  const {teamdomain, username} = req.query;
  if(!teamdomain || !username) return res.sendStatus(400);
  return userActions.getUser({teamdomain, username})
  .then(user => {
    console.log(teamdomain, user.username);
    if(user.username) return console.log('sending true') || res.send({exists: 'true'});
    return res.send({exists: 'false'});
  })
  .catch(() => res.sendStatus(500));
});

router.get('/getInfo', (req, res) => {
  const {inviteID} = req.query;
  if(!inviteID) return res.sendStatus(400);
  return inviteActions.getInviteInfo({inviteID})
    .then(data => res.send(data))
    // .catch(error => console.log(error) || res.sendStatus(500));
})

router.post('/createUser', (req, res) => {

  const fields = req.body;
  return inviteActions.createUserFromInvite(fields)
    .then(user => {
      userActions.login(user)
        .then(token => res.send(token))
     })
     .catch(error => {
       console.log(error);
       res.sendStatus(500);
     });
});

export default router;
