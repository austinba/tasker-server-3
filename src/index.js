import tableRouter from './routes/tables';
import tasksRouter from './routes/tasks';
import usersRouter from './routes/users';
import mockAPIRouter from './mockAPI/routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
const app = express();

// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus:200
// };

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.get('/', (req, res) => {
  res.send('Website is running');
});
app.use('/tables', tableRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);
app.use('/mockapi', mockAPIRouter);

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function() {
  console.log('Example app listening on port ' + app.get('port'));
});
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
