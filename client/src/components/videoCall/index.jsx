import React, { useRef, useEffect } from 'react';
import { Peer } from 'peerjs';
import { authSelector, peerSelector } from 'store/selectors';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

const VideoCall = () => {
  const auth = useSelector(authSelector);
  const peerIdCall = useSelector(peerSelector);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!peerIdCall.id) {
      navigate('/');
    }
    const peer = new Peer(`DELTA${auth.user._id}MEET`);
    peer.on('open', (id) => {
      navigator.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          localVideoRef.current.srcObject = stream;
        },
        (err) => {
          console.log(err);
        },
      );
    });
    peer.on('call', (call) => {
      call.answer(localVideoRef.current.srcObject);
      call.on('stream', (stream) => {
        remoteVideoRef.current.srcObject = stream;
      });
    });
    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <div>
      <div style={{ height: '100vh' }} className="position-relative">
        <video className={style.remoteVideo} ref={remoteVideoRef} autoPlay ></video>
      </div>
      <div style={{ zIndex: 3, bottom: 0, right: 0 }} className="border border-danger position-absolute">
        <video className={style.localVideo} ref={localVideoRef} autoPlay ></video>
      </div>
    </div>
  );
};

export default VideoCall;
