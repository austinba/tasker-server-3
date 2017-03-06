import tableRouter from './routes/tables';
import tasksRouter from './routes/tasks';
import usersRouter from './routes/users';
import mockAPIRouter from './mockAPI/routes';
import loginRouter from './routes/login';
import signupRouter from './routes/signup';
import inviteRouter from './routes/invite';
import takeInviteRouter from './routes/takeInvite';
import { routeReporter } from './routes/utilities';
import { auth } from './auth';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
const app = express();

const corsOptions ={
  optionsSuccessStatus:200
};
if(process.env.NODE_ENV === 'production') {
  corsOptions.origin = 'https://api.quarterstretch.com';
} else {
  corsOptions.origin = 'http://localhost:4000';
}

// TODO: ADD EXPLICIT VALIDATION TO ALL ROUTES

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routeReporter);
app.use(cors());
app.get('/', (req, res) => {
  res.send('Website is running');
});
app.use('/tasks', auth, tasksRouter);
app.use('/users', auth, usersRouter);
app.use('/invite', auth, inviteRouter);
app.use('/tables', tableRouter);
app.use('/takeInvite', takeInviteRouter);
app.use('/mockapi', mockAPIRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.get('/myinfo', auth, function(req, res) {
  res.send(req.user);
});


app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function() {
  console.log('Example app listening on port ' + app.get('port'));
});
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
