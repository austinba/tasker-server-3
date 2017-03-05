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
    assignedFrom:   Joi.string().guid(),
    assignedTo:     Joi.string().guid(),
    level:          Joi.number(),
    checkIns:       Joi.array().items(Joi.string().isoDate()),
    comments:       Joi.array().items(
      Joi.object().keys({
        commentID: Joi.string().guid(),
        from: Joi.string().guid(),
        date: Joi.string().isoDate(),
        comment: Joi.string()
      })
    )
  }
});

export const User = dynogels.define('qs-user', {
  hashKey:        'userID',
  timestamps:     true,
  schema: {
    userID:       dynogels.types.uuid(),
    firstName:    Joi.string().min(1).max(30),
    lastName:     Joi.string().min(1).max(30)
  }
});

// export const User = dynogels.define('qs-user', {
//   hashKey:        'userID',
//   timestamps:     true,
//   schema: {
//     userID:       dynogels.types.uuid(),
//     username:     Joi.string().lowercase().alphanum().min(1).max(15),
//     teamDomain:   Joi.string().lowercase().alphanum().min(1).max(15),
//     email:        Joi.string().email(),
//     passwordHash: Joi.string(),
//     firstName:    Joi.string().min(1).max(30),
//     lastName:     Joi.string().min(1).max(30),
//   }
// });

// export const Team = dynogels.define('qs-team', {
//   hashKey:       'teamDomain',
//   timestamps:    true,
//   schema: {
//     teamDomain:  Joi.string().lowercase().alphanum().min(1).max(15),
//     teamName:    Joi.string().min(1).max(30)
//   }
// })
//
// export const Invite = dynogels.define('qs-invite', {
//   hashKey:       'inviteID',
//   timestamps:    true,
//   schema: {
//     inviteID:    dynogels.types.uuid(),
//     toEmail:     Joi.string().email(),
//     fromUserID:  Joi.string().lowercase().alphanum().min(1).max(15)
//   }
// });
