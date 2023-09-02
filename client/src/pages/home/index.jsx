import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { contactsSelector } from 'store/selectors';
import { login } from 'store/reducers/auth.slice';
import { updateNewRecentContacts } from 'store/reducers/contacts.slice';
import useApiPrivate from 'hooks/useApiPrivate';

import WellCome from 'components/wellcome';
import ChatContainer from 'components/chatContainer';
import Navigation from 'components/navigation';
import Sidebar from 'components/sidebar';
import ChatInput from 'components/chatInput';
import VideoCallNotification from 'components/videoCall/VideoCallNotification';

import { receiverRequest } from 'store/reducers/friendRequest.slice';
import { updatePeerIDCall } from 'store/reducers/peer.slice';
import { showNotification } from '../../helpers/notifications';

function Home() {
  const [chatCurrent, setChatCurrent] = useState(undefined);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [sendfileMessage, setSendFileMessage] = useState(null);
  const [messagesChatCurrent, setMessagesChatCurrent] = useState([]);
  const [personInfo, setPersonInfo] = useState({});
  const [optionNav, setOptionNav] = useState('chat');
  const [chatVideoNotify, setChatVideoNotify] = useState(false);
  // socket
  const socket = useRef(io(process.env.REACT_APP_BACKEND));

  // global state
  const contacts = useSelector(contactsSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { apiPrivate } = useApiPrivate();

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_APP_NAME)) {
      navigate('/auth');
    } else {
      const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_APP_NAME));
      const getMyInformation = async () => {
        const resp = await apiPrivate({ url: '/myInfo' });
        setPersonInfo(resp);
        dispatch(login({ ...token }));
        socket.current.emit('accountConnect', resp._id);
      };
      getMyInformation();
      socket.current.on('friend-Request-receive', (msg) => {
        dispatch(receiverRequest);
      });
      socket.current.on('created-video-chat-room', (chatRoom) => {
        showNotification('Đang gọi');
      });
      socket.current.on('receive-video-call', (call) => {
        dispatch(updatePeerIDCall(call.Callfrom._id));
        setChatVideoNotify(call);
      });
    }
  }, []);

  useEffect(() => {
    sendfileMessage && setMessagesChatCurrent((prevState) => [...prevState, sendfileMessage]);
  }, [sendfileMessage]);
  useEffect(() => {
    if (arrivalMessages && chatCurrent && (arrivalMessages.from === chatCurrent._id || arrivalMessages.users))
      setMessagesChatCurrent((prevState) => [...prevState, arrivalMessages]);
  }, [arrivalMessages]);

  const updateContactRecents = (fromID, content, fromSelf, users) => {
    const prevState = contacts.filter((item) => item.contact._id !== fromID);
    const updateAt = contacts.find((item) => item.contact._id === fromID);
    const newContacts = [{ ...updateAt, content: content, fromSelf: fromSelf, users }, ...prevState];
    dispatch(updateNewRecentContacts(newContacts));
  };

  return (
    <div>
      <div className="application d-flex vh-100 overflow-hidden" id="home">
        <Navigation personInfo={personInfo} optionNav={optionNav} setOptionNav={setOptionNav} setPersonInfo={setPersonInfo} />
        <hr />

        <Sidebar
          setChatCurrent={setChatCurrent}
          optionNav={optionNav}
          user={personInfo}
          setMessages={setMessagesChatCurrent}
          socket={socket}
          setSendFileMessage={setSendFileMessage}
          setArrivalMessages={setArrivalMessages}
          updateContactRecents={updateContactRecents}
        />

        {chatCurrent ? (
          <div style={{ width: '100%' }}>
            <div style={{ height: '85%' }}>
              <ChatContainer socket={socket} chatCurrent={chatCurrent} messages={messagesChatCurrent} setMessages={setMessagesChatCurrent} user={personInfo} />
            </div>
            <div style={{ height: '11%' }}>
              <ChatInput
                contacts={contacts}
                updateContactRecents={updateContactRecents}
                user={personInfo}
                chatCurrent={chatCurrent}
                setMessagesChatCurrent={setMessagesChatCurrent}
              />
            </div>
          </div>
        ) : (
          <WellCome />
        )}
        {chatVideoNotify && (
          <div>
            <VideoCallNotification notification={chatVideoNotify} socketCurrent={socket.current} fromSelf={false} setChatVideoNotify={setChatVideoNotify} />
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
