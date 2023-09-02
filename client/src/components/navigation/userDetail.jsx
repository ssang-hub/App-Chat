import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useApiPrivate from 'hooks/useApiPrivate';

import { IoChevronBackOutline } from 'react-icons/io5';
import { AiOutlineCamera } from 'react-icons/ai';
import style from './style.module.scss';
import { showNotification } from 'helpers/notifications';
import PropTypes from "prop-types";

/**
 * @param {object} personInfo
 * @param {functions} setPersonInfo
 * @returns {JSX.Element}
 */

function UserDetail({ personInfo, setPersonInfo }) {
  const [isChangePersonInfo, setIsChangePersonInfo] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({});
  const { apiPrivate, loading: isLoading } = useApiPrivate();

  // avatar user
  const [avatar, setAvatar] = useState(personInfo.avatar);
  const [coverAvatar, setCoverAvatar] = useState(personInfo.coverAvatar);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [coverAvatarFile, setCoverAvatarFile] = useState(undefined);

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  useEffect(() => {
    return () => {
      coverAvatar && URL.revokeObjectURL(coverAvatar);
    };
  }, [coverAvatar]);

  const onChangePersonInfo = (event) => {
    setNewUserInfo((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
  };

  const onHandleUpdatePersonInfo = async () => {
    try {
      const resp = await apiPrivate({
        url: '/updateMyProfile',
        method: 'PUT',
        data: { ...newUserInfo, avatar: avatarFile, coverAvatar: coverAvatarFile },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPersonInfo(resp);
      setNewUserInfo({});
      setIsChangePersonInfo(false);
    } catch (error) {
      showNotification('Cập nhật không thành công', false);
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="infomationContainer"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="infomationContainer"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                <div className="d-flex">
                  <div className="btn" onClick={() => setIsChangePersonInfo(false)}>
                    <IoChevronBackOutline />
                  </div>
                  <h5 className="pt-2">Thông tin tài khoản</h5>
                </div>
              </h1>
            </div>
            <div className="modal-body padding-15px overflow-hidden ">
              <div>
                <div className="mb-2">
                  <div className="position-relative">
                    <div>
                      <img className="w-100 rounded" src={coverAvatar} alt="" />
                      {isChangePersonInfo && (
                        <div>
                          <label htmlFor="upload-cover-avatar" className="d-block">
                            <div className={style.cameraIcon} style={{ left: 5 }}>
                              <AiOutlineCamera />
                            </div>
                          </label>
                          <input
                            type="file"
                            name="coverAvatar"
                            id="upload-cover-avatar"
                            className={style.uploadPhoto}
                            onChange={(e) => {
                              setCoverAvatarFile(e.target.files[0]);
                              setCoverAvatar(URL.createObjectURL(e.target.files[0]));
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="position-absolute w-100" style={{ bottom: -15 }}>
                      {isChangePersonInfo ? (
                        <div>
                          <label htmlFor="upload-avatar">
                            <img className={clsx(style.avatarDetail, 'position-relative')} src={avatar} alt="" />
                            <div className={style.cameraIcon}>
                              <AiOutlineCamera />
                            </div>
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            id="upload-avatar"
                            className={style.uploadPhoto}
                            onChange={(e) => {
                              setAvatarFile(e.target.files[0]);
                              setAvatar(URL.createObjectURL(e.target.files[0]));
                            }}
                          />
                        </div>
                      ) : (
                        <img className={style.avatarDetail} src={avatar} alt="" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4>{personInfo.fullName}</h4>
                  <div className={style.infomationDetail}>
                    <h6 className="d-flex">Thông tin cá nhân</h6>
                    <div className="mt-4">
                      <table className="table">
                        <tbody>
                          <tr className="d-flex">
                            <td>Ngày Sinh:</td>
                            <td>
                              {isChangePersonInfo ? (
                                <div>
                                  <input type="date" name="DOB" onChange={(e) => onChangePersonInfo(e)} className="form-control" id="" defaultValue={personInfo.DOB} />
                                </div>
                              ) : (
                                <div>{personInfo.DOB}</div>
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Địa chỉ:</td>
                            <td>
                              {isChangePersonInfo ? (
                                <div>
                                  <input
                                    type="text"
                                    name="address"
                                    onChange={(e) => onChangePersonInfo(e)}
                                    className="form-control"
                                    style={{ marginLeft: 20 }}
                                    defaultValue={personInfo.address}
                                  />
                                </div>
                              ) : (
                                personInfo.address
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Giới tính:</td>
                            <td>
                              {isChangePersonInfo ? (
                                <div>
                                  <select name="gender" onChange={(e) => onChangePersonInfo(e)} defaultValue={personInfo.gender} className="form-control form-select" id="">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                  </select>
                                </div>
                              ) : (
                                personInfo.gender
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Email:</td>
                            <td>
                              {isChangePersonInfo ? (
                                <>
                                  <div>
                                    <input
                                      type="email"
                                      name="email"
                                      onChange={(e) => onChangePersonInfo(e)}
                                      className="form-control"
                                      style={{ marginLeft: 20 }}
                                      defaultValue={personInfo.email}
                                    />
                                  </div>
                                </>
                              ) : (
                                personInfo.email
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {isChangePersonInfo ? (
                <button className="btn btn-outline-success" disabled={isLoading} onClick={() => onHandleUpdatePersonInfo()}>
                  {isLoading ? <div className="spinner-border text-primary" role="status"></div> : 'Lưu lại'}
                </button>
              ) : (
                <button className="btn btn-outline-primary" onClick={() => setIsChangePersonInfo(true)}>
                  Chỉnh sửa
                </button>
              )}

              <button type="button" className="btn btn-secondary" onClick={() => setIsChangePersonInfo(false)} data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
UserDetail.prototype = {
  personInfo: PropTypes.object,
  setPersonInfo: PropTypes.func
}
export default UserDetail;
