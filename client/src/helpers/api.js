import axios from 'axios';

const client = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}`,
  headers: {'Content-Type': 'application/json'},
  timeout: 60000,
});

export default client;

/**
 * @return {(uri: string, options?: {headers?, body?, method?: 'GET' | 'POST' | 'PUT' | 'DELETE'}) => Promise<any>}
 */
const createApi = () => {
  const sendRequest = async (uri, options) => {
    const res = await client.request({
      ...options,
      url: uri,
      method: options.method || 'GET',
      data: options.body,
    });
    return res.data;
  };

  return async (uri, options = {}) => sendRequest(uri, options);
};
export const api = createApi();
