import * as teamActions from '../actions/teams';
import * as userActions from '../actions/users';
import express from 'express';
const router = express.Router();

router.get('/doesTeamExist', (req, res) => {
  const {teamdomain} = req.query;
  if(!teamdomain) return res.sendStatus(400);
  return teamActions.getTeam({teamdomain})
  .then(team => {
    console.log(teamdomain, team.teamdomain);
    if(team.teamdomain) return console.log('sending true') || res.send({exists: 'true'});
    return res.send({exists: 'false'});
  })
  .catch(() => res.sendStatus(500));
});

router.post('/createTeam', (req, res) => {
  const fields = req.body;
  return teamActions.addTeamWithInitialUser(fields)
  .then(user => {
    userActions.login(req.body)
      .then(token => res.send(token))
   })
   .catch(error => {
     console.log(error);
     res.sendStatus(500);
   })
})

export default router;
