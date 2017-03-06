import * as userActions from '../actions/users';
import { prettyJSON } from '../helpers';
import express from 'express';
const router = express.Router();

router.post('/', function(req, res) {
  console.log('attempting to login with', req.body)
  userActions.login(req.body)
    .then(token => res.send(token))
    .catch(error => res.send({error: 'failed logging in'}));
});

export default router;
