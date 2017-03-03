import express from 'express';
import http from 'http';
const app = express();
// const config = fs.readFileSync('app_config.json', 'utf8');

app.set('port', process.env.PORT || 4000);

app.get('/', function(req, res) {
  res.send({message: 'Hello world!'});
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Example app listening on port ' + app.get('port'));
});
