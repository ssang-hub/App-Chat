import React, { useEffect, useState } from 'react';
import Header from './headerSidebar';
import AddFriend from './friends/AddFriend';
import Contact from './contact';
import AddGroup from './groups/AddGroup';
import FriendRequest from './friendRequest';
import useApiPrivate from 'hooks/useApiPrivate';
import { useDispatch, useSelector } from 'react-redux';
import { contactSearchSelector, RequestSelector } from 'store/selectors';
import { setFriends, setRecentContacts } from 'store/reducers/contacts.slice';
import PropTypes from "prop-types";

/**
 * @param {function} setChatCurrent
 * @param {string} optionNav
 * @param {object} user
 * @param {function} setMessages
 * @param {function} socket
 * @param {function} setArrivalMessages
 * @param {function} setSendFileMessage
 * @param {function} updateContactRecents
 * @return {JSX.Element}
 * */
function Sidebar({ setChatCurrent, optionNav, user, setMessages, socket, setArrivalMessages, setSendFileMessage, updateContactRecents }) {
  const dispatch = useDispatch();
  const { apiPrivate } = useApiPrivate();
  const myContacts = useSelector(contactSearchSelector);
  const RequestSelect = useSelector(RequestSelector);

  const [socketContactState, setSocketContactState] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const [contacts, friends] = await Promise.all([apiPrivate({ url: '/getContacts' }), apiPrivate({ url: '/getAllFriend' })]);
        dispatch(setRecentContacts(contacts));
        dispatch(setFriends(friends));
        setSocketContactState(true);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, []);
  useEffect(() => {
    if (socketContactState) {
      socket.current.on('msg-recieve', (msg) => {
        setTheLastMessage(msg);
        console.log(msg);
        updateContactRecents(msg.userGroup ? msg.to : msg.from, msg.message.content, false, msg.userGroup);
      });

      socket.current.on('image-receive', (msg) => {
        setTheLastMessage(msg);
        updateContactRecents(msg.from, 'Đã gửi một ảnh', false, msg.userGroup);
      });
      socket.current.on('sticker-receive', (msg) => {
        setTheLastMessage(msg);
        updateContactRecents(msg.from, 'Đã gửi một sticker', false, msg.userGroup);
      });
      socket.current.on('send-image-success', (msg) => {
        const msgSend = { fromSelf: true, message: msg.message };
        setSendFileMessage(msgSend);
      });
    }
  }, [socketContactState]);

  const setTheLastMessage = (msg) => {
    setArrivalMessages({ fromSelf: false, message: msg.message, from: msg.from, users: msg.userGroup, createdAt: msg.createdAt });
  };

  return (
    <div className="border-end border-secondary scrollbar-primary" style={{ maxWidth: '18%', overflow: 'auto', height: '100%' }}>
      <Header />
      {optionNav === 'chat' && <Contact setChatCurrent={setChatCurrent} user={user} myContacts={myContacts} setMessages={setMessages} />}
      {optionNav === 'friend' && <FriendRequest />}

      <AddFriend user={user} />
      <AddGroup user={user} />
    </div>
  );
}

Sidebar.prototype = {
  setChatCurrent: PropTypes.func,
  optionNav: PropTypes.string,
  user: PropTypes.object,
  setMessages: PropTypes.func,
  socket: PropTypes.func,
  setArrivalMessages: PropTypes.func,
  setSendFileMessage: PropTypes.func,
  updateContactRecents: PropTypes.func
}
export default React.memo(Sidebar);
