import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { api } from 'helpers/api';
import { showNotification } from 'helpers/notifications';
import style from './style.module.scss';
import { AiFillBackward } from 'react-icons/ai';

function ResetPassword() {
  const { token } = useParams();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [account, setAccount] = useState({ password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckUrl, setIsCheckUrl] = useState(false);

  useEffect(() => {
    const validateURL = async () => {
      try {
        await api('/checkURLReset', { params: { token } });
      } catch (error) {
        setTokenExpired(true);
      } finally {
        setIsCheckUrl(true);
      }
    };
    validateURL();
  }, []);

  const onChangeValue = async (e) => {
    setAccount((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onHandleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (account.password && account.password !== account.passwordConfirm) {
        showNotification('Mật khẩu không khớp', false);
      } else {
        setIsLoading(true);
        await api('/resetPassword', { params: { token }, method: 'PUT', body: { password: account.password } });
        showNotification('Đã cập nhật mật khẩu', true);
      }
    } catch (error) {
      showNotification('Cập nhật không thành công', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      id="UserConfirm"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="UserConfirmLabel"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="UserConfirmLabel">
              Cập nhật mật khẩu
            </h4>
          </div>
          <div className="modal-body">
            {isCheckUrl ? (
              <div className="container height-100 d-flex justify-content-center align-items-center">
                {tokenExpired ? (
                  <div>Đường dẫn đã hết hạn</div>
                ) : (
                  <div className="position-relative">
                    <div className="card p-2 text-center border-0">
                      <h5>Vui lòng nhập mật khẩu bạn muốn thay đổi</h5>

                      <form onSubmit={onHandleResetPassword}>
                        <div>
                          <input
                            className="m-2 text-center form-control "
                            type="password"
                            style={{ fontSize: 20 }}
                            value={account.password || ''}
                            name="password"
                            onChange={onChangeValue}
                            placeholder="Mật khẩu"
                            required
                          />
                          <input
                            className="m-2 text-center form-control "
                            type="password"
                            style={{ fontSize: 20 }}
                            name="passwordConfirm"
                            onChange={onChangeValue}
                            placeholder="Nhập lại mật khẩu"
                            required
                          />
                        </div>

                        <div className="mt-4">
                          <button type="submit" disabled={isLoading} className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg', 'validate')}>
                            {isLoading ? <div className="spinner-border text-primary" role="status"></div> : 'Cập Nhật'}
                          </button>
                        </div>
                        <div className="mt-4"></div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="spinner-border text-primary" role="status"></div>
            )}
            <div>
              <Link className="btn text-secondary" to={'/auth'}>
                <AiFillBackward />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
