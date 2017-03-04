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
    taskID: 202,
    completionDate: daysAgo(3),
    project: 'Dragonfly',
    description: 'Make sure website is ready for deployment by March 10th',
    assignedFrom: 102,
    assignedTo: 101,
    dueDate: new Date(2017, 2, 1),
    level: 1,
    goal: 'Goal #1',
    comments: [
      {
        commentID: 303,
        from: 101,
        date: daysAgo(2),
        comment: `Wanted to give you a status update. Everything is on schedule except the graphic design. The designers need to update the logos to match the rebranding campaign we just had. If they aren't ready, we'll just use the old logos.`
      }
    ]
  },
  {
    taskID: 204,
    description: `We need to create a poster for the hackathon next month -- can you take care of this? Also, let me give the okay on your idea before you have the poster made.`,
    assignedFrom: 103,
    assignedTo: 101,
    dueDate: new Date(2017, 3, 2),
    level: 3,
    comments: [
      {
        commentID: 313,
        from: 102,
        date: daysAgo(65),
        comment: `Don't worry, we have plenty of time. Just let me know when you have something...`
      },
      {
        commentID: 312,
        from: 101,
        date: daysAgo(66),
        comment: `Okay, turns out Travis' team is doing that already. We'll have to come up with something else`
      },
      {
        commentID: 311,
        from: 101,
        date: daysAgo(67),
        comment: `Jim thought on modeling it off the new Resident Evil movie poster. I think it'd be pretty cool for the event.`
      },
      {
        commentID: 310,
        from: 102,
        date: hoursAgo(68),
        comment: `We did that last year. Any other ideas?`
      },
      {
        commentID: 309,
        from: 101,
        date: hoursAgo(70),
        comment: `I was talking to Sam, she's thinking a space / asteroids theme. What do you think?`
      },
      {
        commentID: 308,
        from: 102,
        date: daysAgo(3),
        comment: `Any ideas so far?`
      }
    ]
  },
  {
    taskID: 201,
    project: 'Ecommerce',
    description: 'Create the design of the shopping website and check in with me. I think it will take about 3 back-and-forths before ready',
    assignedFrom: 101,
    assignedTo: 104,
    dueDate: new Date(2017, 2, 2),
    level: 1,
    goal: 'Goal #2',
    comments: [
      {
        commentID: 301,
        from: 101,
        date: minutesAgo(10),
        comment: `Just swing by the office right now if you're free`
      },
      {
        commentID: 302,
        from: 104,
        date: hoursAgo(1),
        comment: `Okay, just made the first design, when do you think you'll be ready to take a look?`
      }
    ]
  },
  {
    taskID: 203,
    project: 'Dragonfly',
    description: `We need to create tests for our logging system. Deployment of our Dragonfly system is scheduled on March 10th, so we absolutely have to have this done by then`,
    assignedFrom: 101,
    assignedTo: 103,
    dueDate: new Date(2017, 2, 10),
    level: 3,
    comments: [
      {
        commentID: 304,
        from: 103,
        date: daysAgo(1),
        comment: `Hey, just letting you know. I’m focusing on the shopping site right now, but this is well on it’s way. Wilson is doing a code review and after any modifications, we’ll be able to push the tests`
      },
      {
        commentID: 305,
        from: 101,
        date: hoursAgo(26),
        comment: `Hey haven’t heard from you in a while, what is happening with this?`
      },
      {
        commentID: 306,
        from: 103,
        date: daysAgo(8),
        comment: `Okay, thanks for letting me know`
      },
      {
        commentID: 307,
        from: 101,
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
  {userID: 101, firstName: 'Austin', lastName: 'Baltes'},
  {userID: 102, firstName: 'Jiangbo', lastName: 'Cheng'},
  {userID: 103, firstName: 'Nick', lastName: 'Carr'},
  {userID: 104, firstName: 'Chris', lastName: 'Niel'}
];

export const view = {
};
