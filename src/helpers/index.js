import R from 'ramda';

export const prettyJSON = R.pipe(
  inp => typeof inp === 'object' ? inp : {value: inp},
  text => JSON.stringify(text, null, 2),
  R.replace(/ /g, '&nbsp;'),
  R.replace(/\n/g, '<br />')
);
