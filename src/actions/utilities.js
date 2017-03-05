import R from 'ramda';

export const exampleUser = '00000000-0000-0000-0000-000000000101';


export const postProcessGetItem =
  R.prop('attrs');


export const postProcessGetItems =
  R.map(postProcessGetItem);


export const postProcessScan =
  R.pipe(R.prop('Items'), postProcessGetItems);
