import tableRouter from './routes/tables';
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Website is running');
});
app.use('/tables', tableRouter);

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function() {
  console.log('Example app listening on port ' + app.get('port'));
});
