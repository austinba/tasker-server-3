import dynogels from 'dynogels';
import * as Joi from 'joi';
import Promise from 'bluebird';
import _ from 'underscore';
// import config from '~/../config.json';

// dynogels.AWS.config.update(config.dynamoDB);
console.log(`Actual process.env.NODE_ENV: ${process.env.NODE_ENV}`);

var env = process.env.NODE_ENV || 'production';

console.log(`Current Environment: ${env}`);

if(env === 'dev') {
  dynogels.AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000',
  });
} else {
  dynogels.AWS.config.update({
    region: 'us-west-2'
  });
}
export const User = dynogels.define('User', {
  hashKey:        'userID',
  timestamps:     true,
  schema: {
    userID:       dynogels.types.uuid(),
    username:     Joi.string().lowercase().alphanum().min(1).max(15),
    teamDomain:   Joi.string().lowercase().alphanum().min(1).max(15),
    email:        Joi.string().email(),
    passwordHash: Joi.string(),
    firstName:    Joi.string().min(1).max(30),
    lastName:     Joi.string().min(1).max(30),
  }
});

export const Team = dynogels.define('Team', {
  hashKey:       'teamDomain',
  timestamps:    true,
  schema: {
    teamDomain:  Joi.string().lowercase().alphanum().min(1).max(15),
    teamName:    Joi.string().min(1).max(30)
  }
})

export const Invite = dynogels.define('Invite', {
  hashKey:       'inviteID',
  timestamps:    true,
  schema: {
    inviteID:    dynogels.types.uuid(),
    toEmail:     Joi.string().email(),
    fromUserID:  Joi.string().lowercase().alphanum().min(1).max(15)
  }
});

const Model = _.map({ User, Team, Invite }, Promise.promisifyAll);

export default Model;
