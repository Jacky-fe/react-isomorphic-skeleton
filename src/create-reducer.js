import posts from './routes/post-list/reducer';
import { combineReducers } from 'redux';
export const DEFAULT_REDUCER_KEYS = ['posts'];
// Only combine reducers needed for initial render, others will be
// added async
export default function createReducer(asyncReducers) {
  return combineReducers({
    posts,
    ...asyncReducers,
  });
}
