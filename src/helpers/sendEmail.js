import ses from 'node-ses-any-promise';
import config from '../app_config.json';
const client = ses.createClient({key: config.ses.key, secret: config.ses.secret});

function sendEmail(fields) {
  const {from, to, subject, body, plainText} = fields;
  return client.sendEmail({
    to, from, subject, message: body, altText: (plainText || body)
  });
}

export default sendEmail;
