import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
} from '../../constants';
import http from 'utils/http-client';

export function loadPosts() {
  return {
    types: [LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE],
    callAPI: () => http.get('/api/v0/posts'),
    payload: {},
  };
}
