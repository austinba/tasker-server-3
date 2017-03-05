function minutesAgo(minutes) {
  return new Date(Date.now() - (minutes*60*1000))
}
function hoursAgo(hours) {
  return minutesAgo(hours * 60);
}
function daysAgo(days) {
  return hoursAgo(days * 24);
}

export const tasks = [
  {
    taskID: '00000000-0000-0000-0000-000000000202',
    completionDate: daysAgo(3),
    description: 'Make sure website is ready for deployment by March 10th',
    assignedFrom: '00000000-0000-0000-0000-000000000102',
    assignedTo: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date(2017, 2, 1),
    level: 1,
    // comments: [
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000303',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: daysAgo(2),
    //     comment: `Wanted to give you a status update. Everything is on schedule except the graphic design. The designers need to update the logos to match the rebranding campaign we just had. If they aren't ready, we'll just use the old logos.`
    //   }
    // ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000204',
    description: `We need to create a poster for the hackathon next month -- can you take care of this? Also, let me give the okay on your idea before you have the poster made.`,
    assignedFrom: '00000000-0000-0000-0000-000000000103',
    assignedTo: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date(2017, 3, 2),
    level: 3,
    // comments: [
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000313',
    //     from: '00000000-0000-0000-0000-000000000102',
    //     date: daysAgo(65),
    //     comment: `Don't worry, we have plenty of time. Just let me know when you have something...`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000312',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: daysAgo(66),
    //     comment: `Okay, turns out Travis' team is doing that already. We'll have to come up with something else`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000311',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: daysAgo(67),
    //     comment: `Jim thought on modeling it off the new Resident Evil movie poster. I think it'd be pretty cool for the event.`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000310',
    //     from: '00000000-0000-0000-0000-000000000102',
    //     date: hoursAgo(68),
    //     comment: `We did that last year. Any other ideas?`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000309',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: hoursAgo(70),
    //     comment: `I was talking to Sam, she's thinking a space / asteroids theme. What do you think?`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000308',
    //     from: '00000000-0000-0000-0000-000000000102',
    //     date: daysAgo(3),
    //     comment: `Any ideas so far?`
    //   }
    // ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000201',
    description: 'Create the design of the shopping website and check in with me. I think it will take about 3 back-and-forths before ready',
    assignedFrom: '00000000-0000-0000-0000-000000000101',
    assignedTo: '00000000-0000-0000-0000-000000000104',
    dueDate: new Date(2017, 2, 2),
    level: 1,
    // comments: [
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000301',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: minutesAgo(10),
    //     comment: `Just swing by the office right now if you're free`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000302',
    //     from: '00000000-0000-0000-0000-000000000104',
    //     date: hoursAgo(1),
    //     comment: `Okay, just made the first design, when do you think you'll be ready to take a look?`
    //   }
    // ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000203',
    description: `We need to create tests for our logging system. Deployment of our Dragonfly system is scheduled on March 10th, so we absolutely have to have this done by then`,
    assignedFrom: '00000000-0000-0000-0000-000000000101',
    assignedTo: '00000000-0000-0000-0000-000000000103',
    dueDate: new Date(2017, 2, 10),
    level: 3,
    // comments: [
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000304',
    //     from: '00000000-0000-0000-0000-000000000103',
    //     date: daysAgo(1),
    //     comment: `Hey, just letting you know. I’m focusing on the shopping site right now, but this is well on it’s way. Wilson is doing a code review and after any modifications, we’ll be able to push the tests`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000305',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: hoursAgo(26),
    //     comment: `Hey haven’t heard from you in a while, what is happening with this?`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000306',
    //     from: '00000000-0000-0000-0000-000000000103',
    //     date: daysAgo(8),
    //     comment: `Okay, thanks for letting me know`
    //   },
    //   {
    //     commentID: '00000000-0000-0000-0000-000000000307',
    //     from: '00000000-0000-0000-0000-000000000101',
    //     date: daysAgo(9),
    //     comment: `Heads up. Wilson will be the senior developer on this project now, so you can start to work with him`
    //   }
    // ]
  }
];

export const checkIns = {
  201: [hoursAgo(10), hoursAgo(30)],
  202: [daysAgo(2)],
  203: [hoursAgo(1), hoursAgo(30), daysAgo(8)],
  204: [hoursAgo(3)],

}

export const users = [
  {userID: '00000000-0000-0000-0000-000000000101', firstName: 'Austin', lastName: 'Baltes'},
  {userID: '00000000-0000-0000-0000-000000000102', firstName: 'Jiangbo', lastName: 'Cheng'},
  {userID: '00000000-0000-0000-0000-000000000103', firstName: 'Nick', lastName: 'Carr'},
  {userID: '00000000-0000-0000-0000-000000000104', firstName: 'Chris', lastName: 'Niel'}
];

export const view = {
};
