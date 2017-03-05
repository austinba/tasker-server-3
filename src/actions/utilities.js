import R from 'ramda';

export const exampleUser = 'austin@qs';


export const postProcessGetItem =
  R.prop('attrs');


export const postProcessGetItems =
  R.map(postProcessGetItem);


export const postProcessScan =
  R.pipe(R.prop('Items'), postProcessGetItems);
