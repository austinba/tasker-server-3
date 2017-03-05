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
    assignedFrom: 'jcheng@qs',
    assignedTo: 'austin@qs',
    dueDate: new Date(2017, 2, 1),
    level: 1,
    comments: [
      {
        from: 'austin@qs',
        date: daysAgo(2),
        comment: `Wanted to give you a status update. Everything is on schedule except the graphic design. The designers need to update the logos to match the rebranding campaign we just had. If they aren't ready, we'll just use the old logos.`
      }
    ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000204',
    description: `We need to create a poster for the hackathon next month -- can you take care of this? Also, let me give the okay on your idea before you have the poster made.`,
    assignedFrom: 'nick@qs',
    assignedTo: 'austin@qs',
    dueDate: new Date(2017, 3, 2),
    level: 3,
    comments: [
      {
        from: 'jcheng@qs',
        date: daysAgo(65),
        comment: `Don't worry, we have plenty of time. Just let me know when you have something...`
      },
      {
        from: 'austin@qs',
        date: daysAgo(66),
        comment: `Okay, turns out Travis' team is doing that already. We'll have to come up with something else`
      },
      {
        from: 'austin@qs',
        date: daysAgo(67),
        comment: `Jim thought on modeling it off the new Resident Evil movie poster. I think it'd be pretty cool for the event.`
      },
      {
        from: 'jcheng@qs',
        date: hoursAgo(68),
        comment: `We did that last year. Any other ideas?`
      },
      {
        from: 'austin@qs',
        date: hoursAgo(70),
        comment: `I was talking to Sam, she's thinking a space / asteroids theme. What do you think?`
      },
      {
        from: 'jcheng@qs',
        date: daysAgo(3),
        comment: `Any ideas so far?`
      }
    ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000201',
    description: 'Create the design of the shopping website and check in with me. I think it will take about 3 back-and-forths before ready',
    assignedFrom: 'austin@qs',
    assignedTo: '00000000-0000-0000-0000-000000000104',
    dueDate: new Date(2017, 2, 2),
    level: 1,
    comments: [
      {
        from: 'austin@qs',
        date: minutesAgo(10),
        comment: `Just swing by the office right now if you're free`
      },
      {
        from: '00000000-0000-0000-0000-000000000104',
        date: hoursAgo(1),
        comment: `Okay, just made the first design, when do you think you'll be ready to take a look?`
      }
    ]
  },
  {
    taskID: '00000000-0000-0000-0000-000000000203',
    description: `We need to create tests for our logging system. Deployment of our Dragonfly system is scheduled on March 10th, so we absolutely have to have this done by then`,
    assignedFrom: 'austin@qs',
    assignedTo: 'nick@qs',
    dueDate: new Date(2017, 2, 10),
    level: 3,
    comments: [
      {
        from: 'nick@qs',
        date: daysAgo(1),
        comment: `Hey, just letting you know. I’m focusing on the shopping site right now, but this is well on it’s way. Wilson is doing a code review and after any modifications, we’ll be able to push the tests`
      },
      {
        from: 'austin@qs',
        date: hoursAgo(26),
        comment: `Hey haven’t heard from you in a while, what is happening with this?`
      },
      {
        from: 'nick@qs',
        date: daysAgo(8),
        comment: `Okay, thanks for letting me know`
      },
      {
        from: 'austin@qs',
        date: daysAgo(9),
        comment: `Heads up. Wilson will be the senior developer on this project now, so you can start to work with him`
      }
    ]
  }
];

export const checkIns = {
  201: [hoursAgo(10), hoursAgo(30)],
  202: [daysAgo(2)],
  203: [hoursAgo(1), hoursAgo(30), daysAgo(8)],
  204: [hoursAgo(3)],

}

export const users = [
  {username: 'austin', teamdomain: 'qs', email: 'austinba@gmail.com', passwordHash: 'samplehash', firstName: 'Austin',  lastName: 'Baltes'},
  {username: 'jcheng', teamdomain: 'qs', email: 'jbhacker@aol.com', passwordHash: 'samplehash', firstName: 'Jiangbo', lastName: 'Cheng'},
  {username: 'nick',   teamdomain: 'qs', email: 'cooldude@att.com', passwordHash: 'samplehash', firstName: 'Nick',    lastName: 'Carr'},
  {username: 'chris',  teamdomain: 'qs', email: 'neversleep@gmail.com', passwordHash: 'samplehash', firstName: 'Chris',   lastName: 'Niel'}
];

export const teams = [
  {teamdomain: 'qs', teamName: 'Quarterstrech', initialUserID: 'austin@qs'},
  {teamdomain: 'slack', teamName: 'Slack', initialUserID: 'stew@qsb'}
]

export const view = {
};
