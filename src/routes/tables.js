import * as tableActions from '../actions/tables';
import { prettyJSON } from '../helpers';
import express from 'express';
const router = express.Router();

router.get('/create', function(req, res) {
  tableActions.createTables().then(
    data => res.send(prettyJSON({message: 'successfully created tables', data}))
  ).catch(
    err => res.send(prettyJSON({message: 'failed to create tables', err}))
  )
});
router.get('/delete', function(req, res) {
  tableActions.deleteTables().then(
    data => res.send(prettyJSON({message: 'successfully deleted tables', data}))
  ).catch(
    err => res.send(prettyJSON({message: 'failed to delete tables', err}))
  )
});

export default router;
