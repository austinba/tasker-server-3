import Promise from 'bluebird';
import dynogels from 'dynogels';
import R from 'ramda';
import Models from '~/model';
const createTablesAsync = Promise.promisify(dynogels.createTables);

const createParams = {
  'qs-user':   { readCapactiy: 5, writeCapacity: 5 },
  'qs-team':   { readCapacity: 5, writeCapacity: 5 },
  'qs-invite': { readCapacity: 5, writeCapacity: 5 }
};

export function createTables() {
  return createTablesAsync(createParams);
}

export function deleteTables() {
  const result = R.map(model => model.deleteTableAsync())(Models);
  return Promise.all(result);
}
