import Promise from 'bluebird';
import dynogels from 'dynogels';
import R from 'ramda';
import _ from 'underscore';
import w from '~/helpers/winston';
import Models from '~/model';
const createTablesAsync = Promise.promisify(dynogels.createTables);

const createParams = {
  'User':   { readCapactiy: 5, writeCapacity: 5 },
  'Team':   { readCapacity: 5, writeCapacity: 5 },
  'Invite': { readCapacity: 5, writeCapacity: 5 }
};

export function createTables() {
  return createTablesAsync(createParams);
}

export function deleteTables() {
  const result = R.map(model => model.deleteTableAsync())(Models);
  return Promise.all(result);
}
