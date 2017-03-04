import R from 'ramda';

export const prettyJSON = R.pipe(
  inp => R.is(Error)(inp) ? inp.toString()+' '+inp.stack.toString() : inp,
  inp => typeof inp === 'undefined' ? '(undefined)' : inp,
  inp => R.is(Function)(inp) ? inp.toString() : inp,
  inp => typeof inp === 'object' ? inp : {value: inp},
  text => JSON.stringify(text, null, 2),
  R.replace(/ /g, '&nbsp;'),
  R.replace(/\n/g, '<br />')
);
