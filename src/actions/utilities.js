import R from 'ramda';

export const postProcessGetItem =
  R.pipe(R.defaultTo({}), R.prop('attrs'), R.defaultTo({}));


export const postProcessGetItems =
  R.map(postProcessGetItem);


export const postProcessScan =
  R.pipe(R.prop('Items'), postProcessGetItems);
