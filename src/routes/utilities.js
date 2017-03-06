export const routeHandler = (apiFn) => (req, res) => {
  apiFn(req.body)
    .then(data => typeof data !== 'object' ? {data} : data)
    .then(data => res.send(data))
    .catch(err => console.log(err) || res.sendStatus(500));
}

export const routeReporter = (req, res, next) => {
  console.log(req.path);
  console.log(req.body);
  console.log('');
  next();
}
