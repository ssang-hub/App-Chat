import React, { useEffect } from 'react';
import { AiOutlineClose, AiOutlinePhone } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { updatePeerIDCall } from 'store/reducers/peer.slice';
import { useDispatch } from 'react-redux';
import PropTypes from "prop-types";

/**
 * @param {object} notification
 * @param {function} socketCurrent
 * @param {boolean} fromSelf
 * @param {function} setChatVideoNotify
 * @return {JSX.Element}
 * */
function VideoCallNotification({ notification, socketCurrent, fromSelf, setChatVideoNotify }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    socketCurrent.on('refused-call-from-receiver', (data) => {
      setChatVideoNotify(false);
    });
    socketCurrent.on('accept-call-from-receiver', (data) => {
      navigate('/videoChat');
    });
  }, []);
  const refuseVideoCall = () => {
    socketCurrent.emit('refuse-video-call', { data: notification });
    setChatVideoNotify(false);
  };
  const acceptVideoCall = () => {
    dispatch(updatePeerIDCall(notification.Callfrom._id));
    socketCurrent.emit('accept-video-call', { data: notification });
    navigate('/videoChatReceiver');
  };
  const endCall = () => {
    // setChatVideoNotify(false);
  };
  return (
    <div style={{ zIndex: 2 }}>
      <div
        className="modal fade show"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: '#19123b' }}>
            <div className="modal-body">
              <div>
                {fromSelf ? (
                  <img style={{ borderRadius: '50%', width: 50, height: 50 }} src={fromSelf.avatar} alt="" />
                ) : (
                  <img style={{ borderRadius: '50%', width: 50, height: 50 }} src={notification.Callfrom.avatar} alt="" />
                )}
              </div>
              <div>
                {!fromSelf ? <h3 className="text-light">{notification.Callfrom.fullName} đang gọi cho bạn</h3> : <h3>Bạn đang gọi {fromSelf.fullName}</h3>}
                <div className="text-light">Cuộc gọi sẽ bắt đầu ngay khi được chấp nhận</div>
              </div>
              <div className="my-3">
                <div className="d-inline-block mx-3">
                  <div style={{ borderRadius: '50%' }} className="btn btn-danger text-light" onClick={fromSelf ? endCall : refuseVideoCall}>
                    <AiOutlineClose />
                  </div>
                  {fromSelf ? <div className="text-light">Kết thúc</div> : <div className="text-light">Từ chối</div>}
                </div>
                {!fromSelf && (
                  <div className="d-inline-block mx-3" onClick={() => acceptVideoCall()}>
                    <div style={{ borderRadius: '50%' }} className="btn btn-success text-light">
                      <AiOutlinePhone />
                    </div>
                    <div className="text-light">Chấp nhận</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoCallNotification.prototype = {
  notification: PropTypes.object,
  socketCurrent: PropTypes.func,
  fromSelf: PropTypes.bool,
  setChatVideoNotify: PropTypes.func
}
export default VideoCallNotification;
