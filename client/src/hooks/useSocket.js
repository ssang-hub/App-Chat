import { io } from 'socket.io-client';
import { useRef } from 'react';
const useScoket = () => {
  const socket = useRef(io(process.env.REACT_APP_BACKEND));
  return socket;
};
export default useScoket;
