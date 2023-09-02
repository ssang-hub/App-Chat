import {BsEmojiSmile, BsExclamationLg, BsImage} from 'react-icons/bs';
import {ImAttachment} from 'react-icons/im';
import {FcNext, FcPrevious} from 'react-icons/fc';
import EmojiPicker from 'emoji-picker-react';
import {LuSticker} from 'react-icons/lu';
import style from './style.module.scss';
import clsx from 'clsx';
import axios from 'axios';
import {stickerList} from "default/sticker";

import {useEffect, useState} from 'react';
import PropTypes from "prop-types";

/**
 * @param {function} setImageSend
 * @param {function} handleEmojiClick
 * @param {function} sendSticker
 * @return {JSX.Element}
 * */
const ChatInputSecond = ({ setImageSend, handleEmojiClick, sendSticker }) => {
  const [stickerShow, setStickerShow] = useState(false);
  const [showEnojiPicker2, setShowEmojiPicker2] = useState(false);

  //   stickers from  page target sticker
  const [stickerPage, setStickerPage] = useState([]);
  //   page sticker target
  const [stickerPageNumber, setStickerPageNumber] = useState(1);

  const [stickerName, setStickerName] = useState('amy cat');
  //   stickers show
  const [stickerData, setStickerData] = useState([]);

  useEffect(() => {
    if (stickerList.length > 0) setStickerPage(stickerList.slice((stickerPageNumber - 1) * 4, stickerPageNumber * 4));
  }, [stickerPageNumber, stickerList]);

  useEffect(() => {
    const changeSticker = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_TENOR_URL}`, {
          params: {
            q: stickerName,
            key: process.env.REACT_APP_TENOR_KEY,
            client_key: process.env.REACT_APP_GOOGLE,
            limit: 21,
            searchfilter: 'sticker',
          },
        });
        setStickerData(
          data.results.map((item) => {
            return { id: item.id, url: item.media_formats.gif_transparent.url };
          }),
        );
      } catch (error) {
        console.log(error);
      }
    };
    changeSticker();
  }, [stickerName]);

  return (
    <div className={clsx(style.inputV2, 'chat-input-v2', 'd-flex', 'px-4', 'py-1')}>
      <div>
        <label htmlFor="image-input">
          <div className="btn text-light mx-2">
            <BsImage />
          </div>
        </label>
        <input
          type="file"
          name="image"
          id="image-input"
          onChange={(e) => {
            // console.log(123);
            setImageSend(e.target.files[0]);
          }}
        />
      </div>
      <div className="btn text-light mx-2">
        <ImAttachment />
      </div>
      <div
        className="btn text-light mx-2"
        onClick={() => {
          setStickerShow((prevState) => !prevState);
        }}
      >
        <LuSticker />
      </div>
      <div className="btn text-light mx-2">
        <BsExclamationLg />
      </div>
      <div
        className="btn text-light mx-2"
        onClick={() => {
          setShowEmojiPicker2((prevState) => !prevState);
        }}
      >
        <BsEmojiSmile />
      </div>
      {stickerShow && (
        <div className={clsx([style['sticker-box']])}>
          <div className={clsx([style.sticktitle], 'my-3', 'mx-2', 'scrollbar', 'scrollbar-primary')}>
            <div className="p-1 mt-2">
              <FcPrevious
                style={{ fontSize: 20 }}
                onClick={() => {
                  setStickerPageNumber((prevState) => {
                    if (prevState === 1) {
                      return 1;
                    } else {
                      return prevState - 1;
                    }
                  });
                }}
              />
            </div>
            {stickerPage.map((stickerItemList) => (
              <div className="pointerMouse" key={stickerItemList.id} onClick={() => setStickerName(stickerItemList.stickerName)}>
                <img className={style.stickerImageList} src={`${process.env.REACT_APP_STICKER_IMAGE}/${stickerItemList.id}.gif`} alt="" />
              </div>
            ))}
            <div className="p-1 mt-2">
              <FcNext
                style={{ fontSize: 20 }}
                onClick={() => {
                  setStickerPageNumber((prevState) => {
                    return stickerList.length / 4 < prevState ? prevState : prevState + 1;
                  });
                }}
              />
            </div>
          </div>
          <div className={clsx([style.stickerContainer], 'scrollbar', 'scrollbar-primary')}>
            {stickerData.map((stickerItem) => (
              <div className="mx-1 my-1 pointerMouse" key={stickerItem.id} onClick={(e) => sendSticker(stickerItem)}>
                <img src={stickerItem.url} alt="" className={style.stickerItemImage} />
              </div>
            ))}
          </div>
        </div>
      )}
      {showEnojiPicker2 && (
        <div className="position-absolute" style={{ bottom: '10%', left: '35%' }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};
ChatInputSecond.prototype = {
    setImageSend: PropTypes.func,
    handleEmojiClick: PropTypes.func,
    sendSticker: PropTypes.func
}
export default ChatInputSecond;
