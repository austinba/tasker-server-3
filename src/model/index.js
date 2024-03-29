import dynogels from 'dynogels-promisified';
import * as Joi from 'joi';
import Promise from 'bluebird';
import _ from 'underscore';
import R from 'ramda';

console.log('configuring aws', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
  dynogels.AWS.config.update({ region: 'us-west-2' });
} else {
  dynogels.AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000',
  });
}

export const Task = dynogels.define('qs-task', {
  hashKey:         'taskID',
  timestamps:       true,
  schema: {
    taskID:         dynogels.types.uuid(),
    description:    Joi.string(),
    dueDate:        Joi.string().isoDate(),
    completionDate: Joi.string().isoDate(),
    deleteDate:     Joi.string().isoDate(),
    assignedFrom:   Joi.string(),
    assignedTo:     Joi.string(),
    level:          Joi.number(),
    checkIns:       Joi.array().items(Joi.string().isoDate()),
    comments:       Joi.array().items(
      Joi.object().keys({
        from: Joi.string(),
        date: Joi.string().isoDate(),
        comment: Joi.string()
      })
    )
  }
});

export const User = dynogels.define('qs-user', {
  hashKey:        'teamdomain',
  rangeKey:       'username',
  timestamps:     true,
  schema: {
    teamdomain:   Joi.string().lowercase().alphanum().min(1).max(15),
    username:     Joi.string().lowercase().alphanum().min(1).max(15),
    email:        Joi.string().email(),
    passwordHash: Joi.string(),
    firstName:    Joi.string().min(1).max(30),
    lastName:     Joi.string().min(1).max(30)
  }
});

export const Team = dynogels.define('qs-team', {
  hashKey:         'teamdomain',
  timestamps:      true,
  schema: {
    teamdomain:    Joi.string().lowercase().alphanum().min(1).max(15),
    teamName:      Joi.string().min(1).max(30),
    initialUserID: Joi.string().lowercase()
  }
});


export const Invite = dynogels.define('qs-invite', {
  hashKey:       'inviteID',
  timestamps:    true,
  schema: {
    inviteID:    dynogels.types.uuid(),
    teamdomain:  Joi.string().lowercase().alphanum().min(1).max(15),
    toEmail:     Joi.string().lowercase().email(),
    fromUserID:  Joi.string().lowercase()
  }
});
