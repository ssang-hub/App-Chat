import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from "prop-types";
import { BsChatDots, BsBell } from 'react-icons/bs';
import { AiOutlineSetting, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { lougout } from 'store/reducers/auth.slice';
import UserDetail from './userDetail';
import style from './style.module.scss';
import useApiPrivate from "../../hooks/useApiPrivate";

/**
 * @param {object} personInfo
 * @param {string} optionNav
 * @param {function} setOptionNav
 * @param {function} setPersonInfo
 * @return {JSX.Element}
 * */
function Navigation({ personInfo, optionNav, setOptionNav, setPersonInfo }) {
  const dispatch = useDispatch();
  const [requestCount, setRequestCount] = useState(0)
  const {apiPrivate} = useApiPrivate()

  useEffect(() => {
    const getCountRequest = async () =>{
      const data = await apiPrivate({url: '/getNumberRequest'})
      setRequestCount(data)
    }
    getCountRequest()
  }, []);

  const onHandleLogout = () => {
    localStorage.removeItem(process.env.REACT_APP_APP_NAME);
    dispatch(lougout());
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: '#343a404d' }}>
      <div>
        <div className="dashboard d-flex flex-column justify-content-between w-5 mt-4 " style={{ width: 80 }}>
          <div className="d-flex flex-column">
            <div className="user my-3">
              <div className="btn-group dropend">
                <button type="button" className={clsx('btn', 'p-0', 'dropdown-toggle', [style['btn-user']])} data-bs-toggle="dropdown" aria-expanded="false">
                  <img style={{ width: '100%', borderRadius: '50%' }} src={`${personInfo.avatar}`} alt="" />
                </button>
                <ul className={clsx([style['user-menu']], 'dropdown-menu')}>
                  <li>
                    <h5 className="px-3">{personInfo.fullName}</h5>
                  </li>
                  <hr />
                  <li className={style.hoverOptionBtn}>
                    <div className={clsx(style.optionBtn, 'px-3')} data-bs-toggle="modal" data-bs-target="#infomationContainer">
                      Hồ sơ của bạn
                    </div>
                  </li>
                  <li className={style.hoverOptionBtn}>
                    <div className={clsx('px-3', style.optionBtn)}>Cài đặt</div>
                  </li>
                  <hr />
                  <li>
                    <div className={style.logoutBtn} onClick={() => onHandleLogout()}>
                      Đăng xuất
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: optionNav === 'chat' })} onClick={() => setOptionNav('chat')}>
              <BsChatDots />
            </div>
          </div>
          <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: optionNav === 'friend' })} onClick={() => setOptionNav('friend')}>
            <div className="pb-2 position-relative">
              <AiOutlineUsergroupAdd />
              <div className={clsx([style['number-Request']], 'btn-danger', 'px-1')}>
                {requestCount!==0 && <span className="badge rounded-pill badge-notification bg-danger">{requestCount}</span>}
              </div>
            </div>
          </div>
          <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: optionNav === 'notify' })} onClick={() => setOptionNav('notify')}>
            <BsBell />
          </div>
          <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: optionNav === 'Setting' })} onClick={() => setOptionNav('Setting')}>
            <AiOutlineSetting />
          </div>
        </div>
        {personInfo._id && <UserDetail personInfo={personInfo} setPersonInfo={setPersonInfo} />}
      </div>
    </div>
  );
}

Navigation.prototype = {
  personInfo: PropTypes.object,
  optionNav: PropTypes.string,
  setOptionNav: PropTypes.func,
  setPersonInfo: PropTypes.func
}
export default React.memo(Navigation);
