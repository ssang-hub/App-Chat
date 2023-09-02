import clsx from 'clsx';
import { AiOutlineSearch, AiOutlineUsergroupAdd, AiOutlineVideoCamera } from 'react-icons/ai';
import style from './style.module.scss';
import useScoket from 'hooks/useSocket';
import VideoChatNotify from 'components/videoCall/VideoCallNotification';
import { useState } from 'react';

import { updatePeerIDCall } from 'store/reducers/peer.slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

/**
 * @param {object} chatCurrent
 * @param {object} user
 * @return {JSX.Element}
 * */
function Header({ chatCurrent, user }) {
  const socket = useScoket();
  const [chatVideoNotify, setchatVideoNotify] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onHandleVideoCall = () => {
    socket.current.emit('create-video-chat', { from: user._id, to: chatCurrent._id });
    dispatch(updatePeerIDCall(chatCurrent._id));
    navigate('/videoChat');
    setchatVideoNotify(true);
  };
  const showInput = () => {
    var inputContainer = document.querySelector('.input-search-message');
    inputContainer.classList.add('active-input-search-message');
  };
  return (
    <div className={clsx('d-flex', 'justify-content-between', 'p-3', style.header)}>
      <div className="d-flex">
        <div>
          <img className={style.avatar} src={chatCurrent.avatar} alt="" />
        </div>
        <h5 className="m-auto">{chatCurrent.fullName || chatCurrent.name}</h5>
      </div>
      <div className="d-flex justify-content-around">
        <div className={clsx('m-auto', [style['btn-header-chat']])} onClick={() => showInput()}>
          <AiOutlineSearch />
        </div>
        <div className="input-search-message form-outline">
          <input type="text" className="form-control mt-2" placeholder="Nội dung cần tìm" />
        </div>
        {chatCurrent.admin ? (
          <></>
        ) : (
          <>
            <div className={clsx('m-auto', [style['btn-header-chat']])} data-bs-toggle="modal" data-bs-target="#addGroupContainer">
              <AiOutlineUsergroupAdd />
            </div>
            <div className={clsx('m-auto', [style['btn-header-chat']])} onClick={() => onHandleVideoCall()}>
              <AiOutlineVideoCamera />
            </div>
          </>
        )}
      </div>
      {chatVideoNotify && (
        <div>
          <VideoChatNotify chatVideoNotifydata={chatVideoNotify} socketCurrent={socket.current} fromSelf={chatCurrent} setChatVideoNotify={setchatVideoNotify} />
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
Header.prototype = {
  chatCurrent : PropTypes.object,
  user: PropTypes.object
}
export default Header;
