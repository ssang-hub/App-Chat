import { useCallback, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from 'store/reducers/auth.slice';
import { authSelector } from 'store/selectors';
import useRefreshToken from './useRefreshToken';

export const client = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

function useApiPrivate() {
  const handleRefreshToken = useRefreshToken();
  const [loading, setLoading] = useState(false);
  const user = useSelector(authSelector);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async ({ url, method = 'GET', data = null, options = {}, headers = {} }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.request({
        ...options,
        url: url,
        method: method,
        headers: { ...headers, Authorization: `Bearer ${user.accessToken || JSON.parse(localStorage.getItem(process.env.REACT_APP_APP_NAME)).accessToken}` },
        data: data,
      });
      return res.data;
    } catch (error) {
      const prevRequest = error.config;
      if (error.response.status === 401) {
        const newToken = await handleRefreshToken();
        prevRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
        dispatch(refreshToken(newToken));
        localStorage.setItem(process.env.REACT_APP_APP_NAME, JSON.stringify(newToken));
        const resp = await client(prevRequest);
        return resp.data;
      }
      throw error.response.data
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiPrivate: sendRequest, loading, error };
}

export default useApiPrivate;
