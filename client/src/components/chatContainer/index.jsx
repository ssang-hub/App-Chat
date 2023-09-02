import React, {memo, useEffect, useRef, useState} from 'react';
import Header from './header';
import style from './style.module.scss';
import useApiPrivate from 'hooks/useApiPrivate';
import Gallery from './gallery';
import PropTypes from "prop-types";

/**
 * @param {function} socket
 * @param {object} chatCurrent
 * @param {[string]} messages
 * @param {object} user
 * @param {function} setMessages
 * @return {JSX.Element}
 * */
function ChatContainer({socket, chatCurrent, messages, user, setMessages}) {
  const myContainerRef = useRef(null);
  const [numberPage, setNumberPage] = useState(0);
  const [typing, setTyping] = useState(false);

  const {apiPrivate} = useApiPrivate();

  const handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      setNumberPage((prevState) => prevState + 1);
    }
  };
  useEffect(() => {
    if (chatCurrent) {
      const myContainer = myContainerRef.current;
      myContainer.addEventListener('scroll', handleScroll);
      setNumberPage(1);
      socket.current.on('on-typing-receiver', (msg) => {
        if (chatCurrent._id.toString() === msg.from.toString()) {
          setTyping(true);
        }
      });
      socket.current.on('off-typing-receiver', (msg) => {
        if (chatCurrent._id.toString() === msg.from.toString()) {
          setTyping(false);
        }
      });
      return () => {
        myContainer.removeEventListener('scroll', handleScroll);
        socket.current.removeAllListeners('on-typing-receiver');
        socket.current.removeAllListeners('off-typing-receiver');
        setTyping(false);

        // socket.current.off('off-typing', {});
      };
    }
  }, [chatCurrent]);

  useEffect(() => {
    const getNewMessages = async () => {
      if (numberPage > 0) {
        try {
          const resp = await apiPrivate({url: `/getMessages`, options: {params: {u: chatCurrent._id, p: numberPage}}});
          if (resp.length === 0) {
            myContainerRef.current.removeEventListener('scroll', handleScroll);
          } else {
            setMessages((prevState) => {
              const olderMessage = resp.map((msg) => {
                return { fromSelf: msg.from !== chatCurrent._id, message: msg.message };
              });
              return olderMessage.concat(prevState);
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getNewMessages();
  }, [numberPage]);

  useEffect(() => {
    const objDiv = document.getElementById('scroll-content');
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);
  return (
    <div className="chat-container h-100">
      <div>
        <Header chatCurrent={chatCurrent} user={user} />
      </div>
      <div ref={myContainerRef} className="content text-light p-4 scrollbar-primary" id="scroll-content" style={{ overflow: 'auto', height: '87%' }}>
        {messages.length === 0 && <div className="spinner-border text-light" role="status"></div>}
        {messages.map((message, index) => (
          <div style={{ marginTop: 30, marginBottom: 30 }} key={index}>
            {message.fromSelf ? (
              <div className="position-relative">
                <div className="d-flex flex-row justify-content-end position-relative">
                  <div style={{ marginRight: 35 }}>
                    {message.message.type === 'sticker' && <img src={message.message.content} className={style.stickerSize} style={{ marginRight: 10 }} />}
                    {message.message.type === 'image' && (
                      <div style={{ marginRight: 15 }}>
                        <Gallery image={message.message.content} />
                      </div>
                    )}

                    {message.message.type === 'text' && (
                      <p className="small p-3 me-3 mb-1 text-white rounded-3 bg-primary font-size-16" style={{ backgroundColor: '#f5f6f7' }}>
                        {message.message.content}
                      </p>
                    )}
                  </div>
                  <div className="position-absolute" style={{ bottom: 0 }}>
                    <img src={user.avatar} alt="avatar 1" style={{ width: 45, height: '100%', borderRadius: '50%' }} />
                  </div>
                </div>
                <p className="small rounded-3 text-muted position-absolute end-0" style={{ marginRight: 50 }}>
                  {message.createdAt}
                </p>
              </div>
            ) : (
              <div className="position-relative">
                <div className="d-flex flex-row justify-content-start position-relative">
                  <div className="position-absolute" style={{ bottom: 0 }}>
                    <img src={chatCurrent.admin ? message.users.avatar : chatCurrent.avatar} alt="avatar 1" style={{ width: 45, height: '100%', borderRadius: '50%' }} />
                  </div>
                  <div style={{ marginLeft: 35 }}>
                    {message.message.type === 'sticker' && <img src={message.message.content} className={style.stickerSize} style={{ marginLeft: 10 }} />}
                    {message.message.type === 'image' && (
                      <div style={{ marginLeft: 15 }}>
                        <Gallery image={message.message.content} />
                      </div>
                    )}
                    {message.message.type === 'text' && (
                      <div>
                        <p className="small p-3 ms-3 mb-1 rounded-3 text-dark font-size-14" style={{ backgroundColor: '#f5f6f7' }}>
                          {message.message.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="small rounded-3 text-muted position-absolute" style={{ marginLeft: 50 }}>
                  {message.createdAt}
                </p>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="d-flex flex-row justify-content-start position-relative">
            <div className="position-absolute" style={{ bottom: -10 }}>
              <img src={chatCurrent.avatar} alt="avatar 1" style={{ width: 45, height: '100%', borderRadius: '50%' }} />
            </div>
            <div style={{ marginLeft: 35 }}>
              <img src="https://media.tenor.com/y29vJ0OqaQ4AAAAi/typing-texting.gif" style={{ maxHeight: 50, marginLeft: 5 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ChatContainer.prototype = {
  socket: PropTypes.func,
  chatCurrent: PropTypes.object,
  messages: PropTypes.array,
  user: PropTypes.object,
  setMessages: PropTypes.func
}
export default memo(ChatContainer);
