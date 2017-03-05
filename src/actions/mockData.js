import * as mockData from '../mockAPI/mockData';
import R from 'ramda';
import Promise from 'bluebird';
import Models from '../model';

export const loadMockDataFrom = (model, data) => {
  const stringifiedDates = R.pipe(JSON.stringify, JSON.parse)(data);
  return Promise.all(R.map(model.createAsync, stringifiedDates))
}
export const loadMockData = () => {
  return Promise.all([
    loadMockDataFrom(Models.User, mockData.users),
    loadMockDataFrom(Models.Task, mockData.tasks)
  ]);
};