import dynogels from 'dynogels';
import * as Joi from 'joi';
import Promise from 'bluebird';
import _ from 'underscore';
import config from '~/../config.json';

dynogels.AWS.config.update(config.dynamoDB);

export const User = dynogels.define('qs-users', {
  hashKey:        'userID',
  rangeKey:       'teamID',
  timestamps:     true,
  schema: {
    userID:       Joi.string().lowercase().alphanum().min(1).max(15),
    teamID:       Joi.string().lowercase().alphanum().min(1).max(15),
    email:        Joi.string().email(),
    passwordHash: Joi.string(),
    firstName:    Joi.string().min(1).max(30),
    lastName:     Joi.string().min(1).max(30),
  }
});

export const Team = dynogels.define('qs-teams', {
  hashKey:       'teamID',
  timestamps:    true,
  schema: {
    teamID:      Joi.string().lowercase().alphanum().min(1).max(15),
    teamName:    Joi.string().min(1).max(30)
  }
})

export const Invite = dynogels.define('qs-invites', {
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
