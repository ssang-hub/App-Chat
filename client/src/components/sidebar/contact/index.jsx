import React from 'react';
import clsx from 'clsx';
import style from '../style.module.scss';
import useApiPrivate from 'hooks/useApiPrivate';
import PropTypes from "prop-types";

/**
 * @param {function} setChatCurrent
 * @param {array<object>} myContacts
 * @param {object} user
 * @param {function} setMessages
 * @return {JSX.Element}
 * */
function Contact({ setChatCurrent, myContacts, user, setMessages }) {
  const { apiPrivate } = useApiPrivate();

  const onGetRecentMessages = async (chatCurrent) => {
    const messages = await apiPrivate({ url: `/getMessages`, options: { params: { u: chatCurrent._id, p: 0 } } });
    setMessages(
      messages.map((msg) => {
        return { fromSelf: msg.from !== chatCurrent._id, message: msg.message, createdAt: msg.createdAt };
      }),
    );
  };

  const onGetGroupMessages = async (chatCurrent) => {
    const groupMessages = await apiPrivate({ url: `/getGroupMessages`, options: { params: { groupId: chatCurrent._id, p: 0 } } });
    setMessages(
      groupMessages.map((msg) => {
        return { fromSelf: msg.users._id === user._id, message: msg.message, users: msg.users, createdAt: msg.createdAt };
      }),
    );
    // const usersInGroup = await apiPrivate.get(`/getUsersInGroup`, { params: { groupId: chatCurrent._id } });
  };
  const onHandleSetChatCurrent = async (chatCurrent) => {
    try {
      setMessages([]);
      chatCurrent.admin ? onGetGroupMessages(chatCurrent) : onGetRecentMessages(chatCurrent);
      setChatCurrent(chatCurrent);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {myContacts.map((item) => (
        <div key={item._id} className={clsx(style.friendBtn, 'p-3')} onClick={() => onHandleSetChatCurrent(item.contact)}>
          <div className="d-flex ">
            <div>
              <img src={item.contact ? item.contact.avatar : item.avatar} className={style.avatar} alt="" />
            </div>
            <div className={clsx('text-light', 'd-flex', 'pt-2', 'px-2')}>{item.contact ? item.contact.fullName || item.contact.name : item.name}</div>
            <div className="text-secondary p-2" style={{ marginLeft: 40 }}>
              {item.contact && !item.contact.isFriend && !item.contact.admin && 'Người lạ'}
            </div>
          </div>
          {item.contact && (
            <div className="d-flex text-light" style={{ marginLeft: 10, marginTop: 10 }}>
              {item.fromSelf ? <span>Bạn: </span> : <span>{item.users ? item.users.fullName : item.contact.fullName.split(' ')[1]}: </span>}
              <p style={{ marginLeft: 5 }}>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

Contact.prototype = {
  setChatCurrent: PropTypes.func,
  myContacts: PropTypes.array,
  user: PropTypes.object,
  setMessages: PropTypes.func,
}
export default React.memo(Contact);
