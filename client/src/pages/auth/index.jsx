import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api } from 'helpers/api';
import clsx from 'clsx';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineUser, AiFillBackward } from 'react-icons/ai';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';

import style from './style.module.scss';
import { login } from 'store/reducers/auth.slice';
import { showNotification } from 'helpers/notifications';

function Auth() {
  const [authOption, setAuthOption] = useState('login');
  const [user, setUser] = useState({
    accountName: '',
    password: '',
  });

  const [email, setEmail] = useState('');
  const [IsLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_APP_NAME)) {
      navigate('/');
    }
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE });
    });
  }, []);

  // handle login with account name and password
  const onHandleLogin = async (event) => {
    event.preventDefault();
    if (!(user.accountName && user.password)) {
      showNotification('Vui lòng nhập đầy đủ thông tin', false);
    } else {
      try {
        setIsLoading(true);
        const { userInfo, ...data } = await api('/login', { method: 'POST', body: { user } });
        console.log(userInfo);

        dispatch(login({ ...data, user: userInfo }));
        localStorage.setItem(process.env.REACT_APP_APP_NAME, JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        error.response && error.response.status !== 403
          ? showNotification('Vui lòng nhập lại thông tin', false)
          : showNotification('Tài khoản hoặc mật khẩu không chính xác', false);
        setIsLoading(false);
      }
    }
  };

  // handle login with google
  const onHandleGoogleAuth = async (profileObj) => {
    const data = await api('/googleVerify', { method: 'POST', body: { tokenId: profileObj.tokenId } });
    // dispatch(login({ ...data, user: jwtDecode(data.accessToken) }));
    localStorage.setItem(process.env.REACT_APP_APP_NAME, JSON.stringify(data.data));
    navigate('/');
  };

  const onHandleRegister = async (event) => {
    event.preventDefault();

    if (!(user.fullName && user.password && user.passwordConfirm && user.accountName)) {
      showNotification('Vui lòng nhập đầy đủ thông tin', false);
    } else if (!(user.password === user.passwordConfirm)) {
      showNotification('Mật khẩu không khớp', false);
    } else {
      try {
        setIsLoading(true);
        await api('/register', { method: 'POST', body: user });
        showNotification('Tạo tài khoản thành công', true);
      } catch (error) {
        error.response && error.response.status === 403 && showNotification('Tên tài khoản đã tồn tại', false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onHanleResetPassword = async (event) => {
    event.preventDefault();
    if (email) {
      try {
        setIsLoading(true);
        await api('/forgotPassword', { body: { email, accountName: user.accountName }, method: 'POST' });
        showNotification('Vui lòng kiểm tra email');
      } catch (error) {
        error.response && error.response.status === 403 && showNotification('Thông tin không chính xác, vui lòng kiểm tra lại', false);
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification('Vui lòng nhập đầy đủ thông tin', false);
    }
  };

  const onChangeValue = (event) => {
    setUser((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  return (
    <div>
      <div className={clsx('container', [style['float-in']])}>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className={clsx(style.card, 'card', 'py-5', 'px-2')}>
              <p className="text-center mb-3 mt-2">APP CHAT NODEJS</p>
              <div className="mx-auto d-flex">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE}
                  onSuccess={onHandleGoogleAuth}
                  onFailure={(resp) => {
                    console.log(resp);
                  }}
                  cookiePolicy={'single_host_origin'}
                  render={(renderProps) => (
                    <div className={clsx('mx-2', 'px-3', 'py-2', style.socialBtn)} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      <FcGoogle />
                    </div>
                  )}
                />
              </div>
              <div className={clsx('division', style.division)}>
                <div>
                  <div className="col-6 m-auto">
                    <span>THAM GIA CÙNG CHÚNG TÔI</span>
                  </div>
                  <hr />
                </div>
              </div>
              {authOption !== 'forgot' ? (
                <form onSubmit={authOption === 'login' ? onHandleLogin : onHandleRegister} className={clsx(style.myform)}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="accountName"
                      className={clsx('form-control', style.formInput)}
                      onChange={(e) => onChangeValue(e)}
                      placeholder="Tên tài khoản"
                      required
                    />
                  </div>
                  {authOption === 'register' && (
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        className={clsx('form-control', style.formInput)}
                        onChange={(e) => onChangeValue(e)}
                        placeholder="Tên người dùng"
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <input type="password" name="password" className={clsx('form-control', style.formInput)} onChange={(e) => onChangeValue(e)} placeholder="Mật khẩu" required />
                  </div>
                  {authOption === 'register' && (
                    <div className="form-group">
                      <input
                        type="password"
                        name="passwordConfirm"
                        className={clsx('form-control', style.formInput)}
                        onChange={(e) => onChangeValue(e)}
                        placeholder="Xác nhận mật khẩu"
                        required
                      />
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className={clsx('col-md-8', 'col-12', style.bn)} onClick={() => setAuthOption('forgot')}>
                        Quên mật khẩu
                      </div>
                    </div>
                    {authOption === 'login' ? (
                      <div className={clsx('col-md-5', 'col-12', style.bn)} onClick={() => setAuthOption('register')}>
                        Đăng ký
                      </div>
                    ) : (
                      <div className={clsx('col-md-5', 'col-12', style.bn)} onClick={() => setAuthOption('login')}>
                        Đăng Nhập
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-3">
                    {authOption === 'login' ? (
                      <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                        {IsLoading ? (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <small>
                            <AiOutlineUser className="mx-1" />
                            Đăng Nhập
                          </small>
                        )}
                      </button>
                    ) : (
                      <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                        {IsLoading ? (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <small>
                            <AiOutlineUser className="mx-1" />
                            Đăng Ký
                          </small>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div>
                  <form onSubmit={(e) => onHanleResetPassword(e)}>
                    <div className="m-auto" style={{ width: '85%' }}>
                      <input
                        className={clsx('form-control', style.formInput)}
                        type="email"
                        placeholder="Email khôi phục"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="m-auto" style={{ width: '85%' }}>
                      <input
                        type="text"
                        name="accountName"
                        className={clsx('form-control', style.formInput)}
                        placeholder="Tên tài khoản"
                        onChange={(e) => onChangeValue(e)}
                        required
                      />
                    </div>
                    <div>
                      <div className="w-100">
                        <button type="submit" disabled={IsLoading} className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                          {IsLoading ? <div className="spinner-border text-light spinner-border-sm" role="status"></div> : 'Xác nhận'}
                        </button>
                      </div>
                      <div
                        className="btn text-secondary"
                        onClick={() => {
                          setAuthOption('login');
                        }}
                      >
                        <AiFillBackward />
                        Quay lại đăng nhập
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
