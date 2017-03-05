import { prettyJSON } from '../helpers';
import express from 'express';
const router = express.Router();

router.get('/user-exists', function(req, res) {
  res.send('no route defined');
});

export default router;
