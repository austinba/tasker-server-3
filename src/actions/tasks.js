import { tasks as mockTasks } from '../mockAPI/mockData';
import R from 'ramda';
import Models from '../model';
const User = Models.User;

export const createMockTasks = () => {
  const mockTasksStringDates = R.pipe(JSON.stringify, JSON.parse)(mockTasks);
  return Promise.all(R.map(User.createAsync, mockTasksStringDates))
};
