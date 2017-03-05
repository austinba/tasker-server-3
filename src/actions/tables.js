import Promise from 'bluebird';
import dynogels from 'dynogels';
import R from 'ramda';
import * as Models from '~/model';
const createTablesAsync = Promise.promisify(dynogels.createTables);

const createParams = {
  'qs-task':   { readCapactiy: 5, writeCapacity: 5 },
  'qs-user':   { readCapactiy: 5, writeCapacity: 5 },
  'qs-team':   { readCapacity: 5, writeCapacity: 5 },
  'qs-invite': { readCapacity: 5, writeCapacity: 5 }
};

export function createTables() {
  return createTablesAsync(createParams);
}

export function deleteTables() {
  const result = R.pipe(
   R.map(model => model.deleteTableAsync()),
   R.values
 )(Models);
  return Promise.all(result);
}
