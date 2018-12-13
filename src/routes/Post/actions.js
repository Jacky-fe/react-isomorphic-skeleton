import {
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../../constants';
import http from 'utils/http-client';

export function loadPost(slug) {
  return {
    // 异步请求使用三态actions，call-api-middleware.js会自动处理
    types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],
    callAPI: async () => { 
      const res = await http.get(`/api/v0/post/${slug}`)
      console.log(res);
      return http.get(`/api/v0/post/${slug}`); 
    },
    payload: { slug },
  };
}
