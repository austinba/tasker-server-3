import express from 'express';
const app = express();

app.get('/', function(req, res) {
  res.send({message: 'Hello world!'});
});

app.listen(4000, function() {
  console.log('Example app listening on port 3000!');
});
