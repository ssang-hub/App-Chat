import { api } from 'helpers/api';

function useRefreshToken() {
  const refreshToken = async () => {
    try {
      const tokens = await api('/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem(process.env.REACT_APP_APP_NAME)).refreshToken}` },
      });

      return tokens;
    } catch (error) {
      console.log(error);
    }
  };
  return refreshToken;
}

export default useRefreshToken;
