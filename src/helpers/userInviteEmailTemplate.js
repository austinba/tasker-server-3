let rootAddress;
if(process.env.NODE_ENV === 'production') {
  rootAddress = 'https://quarterstretch.com';
} else {
  rootAddress = 'http://localhost:3000';
}
let inviteGetAddress = (inviteID) => `${rootAddress}/invite/${inviteID}`;

export function userInviteEmailTemplate({fromFirstName, fromLastName, teamdomain, inviteID}) {
  const inviteAddress = inviteGetAddress(inviteID);
  return {
    subject: `${fromFirstName} ${fromLastName} invited you to join ${teamdomain}
              on Quarterstrech`,
    body:    `<h2>Welcome to Quarterstretch!</h2> You were invited by
              ${fromFirstName}.
              <br /><br />
              <a href="${inviteAddress}">Click here</a> to join
              team ${teamdomain}.
              <br /><br /><br />
              If you are unable to click the link, please copy this link
              into your browser window: ${inviteAddress}.
              <br /><br /><br /><br />
              We take all complaints seriously, please send an email to
              austinba@gmail.com to be removed from the mailing list.`
  };
}
