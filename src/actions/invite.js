import { Invite } from '../model';
import { postProcessGetItem } from './utilities';
import sendEmail from '../helpers/sendEmail';
import emailValidate from 'email-validator';
import R from 'ramda';
import { userInviteEmailTemplate } from '../helpers/userInviteEmailTemplate';
import normalizeEmail from 'normalize-email';
import * as userActions from './users';

const normalize = R.evolve({
  toEmail: normalizeEmail,
  teamdomain: R.toLower,
});
const keys = R.pick(['inviteID']);
const fields = R.pick(['inviteID', 'fromUserID', 'teamdomain', 'toEmail']);
const keysNormalized = R.pipe(keys, normalize);
const fieldsNormalized = R.pipe(fields, normalize);

export function invite({thisUser, email}) {
  if(!emailValidate.validate(email)) {
    return Promise.reject(new Error('not a valid email'));
  }
  return addInvite(thisUser, email)
    .then(invite => {
      const additionalParams = {};
      const message = userInviteEmailTemplate({
        fromFirstName: thisUser.firstName,
        fromLastName:  thisUser.lastName,
        teamdomain:    thisUser.teamdomain,
        inviteID:      invite.inviteID
      });
      return sendEmail({
        to: invite.toEmail,
        from: 'no-reply@quarterstretch.com',
        subject: message.subject,
        body: message.body
      })
      .catch(err => {
        additionalParams.emailFailed = true,
        additionalParams.inviteID = invite.inviteID
      })
      .then(result =>
        R.is(Object, result) ? R.merge(result, additionalParams) : additionalParams
      );
    });
}

export function createUserFromInvite(fields) {
  return getInviteInfo(fields)
    .then(inviteData => {
      const addUserFields = R.merge(fields, {email: inviteData.toEmail, teamdomain: inviteData.teamdomain});
      return userActions.addUserWithPass(addUserFields);
    });
}

export function getInviteInfo(fields) {
  return Invite.getAsync(keysNormalized(fields))
    .then(postProcessGetItem);
}

export function addInvite(user, email) {
  const fields =
    { fromUserID: user.userID,
      teamdomain: user.teamdomain,
      toEmail:    email,
    };
  return Invite.createAsync(fieldsNormalized(fields))
    .then(postProcessGetItem);
}
