import R from 'ramda';
import { addUserID } from '../actions/users';

export const routeHandler = (apiFn) => (req, res) => {
  const input = R.pipe( // wrap if not an object
    R.when  (R.is(Array) , R.objOf('data')),
    R.unless(R.is(Object), R.objOf('data')),
    R.assoc ('thisUser'  , req.user), // assign the current user data to that object
    R.evolve({thisUser: addUserID})
  )(req.body)
  apiFn(input)
    .then(data => typeof data !== 'object' ? {data} : data)
    .then(data => res.send(data))
    .catch(err => console.error(err) || res.sendStatus(500));
}

export const routeReporter = (req, res, next) => {
  console.log(req.path);
  console.log(req.body, req.query);
  console.log('');
  next();
}
