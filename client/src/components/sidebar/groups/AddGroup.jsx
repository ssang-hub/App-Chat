import React, { useState } from 'react';
import SettupavatarGroup from './SettupavatarGroup';
import { AiOutlineCamera, AiOutlineSearch } from 'react-icons/ai';
import style from '../style.module.scss';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { friendRemainingSelector } from 'store/selectors';
import { changeFilter } from 'store/reducers/contacts.slice';
import useApiPrivate from 'hooks/useApiPrivate';
import useScoket from 'hooks/useSocket';
import { showNotification } from 'helpers/notifications';
import PropTypes from "prop-types";
/**
 * @returns {JSX.Element}
 */
function AddGroup() {
  const [selectAvatarGroup, setSelectAvatarGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [avatarSelected, setAvatarSelected] = useState();
  const [groupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const myFriends = useSelector(friendRemainingSelector);
  const dispatch = useDispatch();

  const { apiPrivate } = useApiPrivate();

  const socket = useScoket();
  // choose contact to group
  const handleAddFriends = (obj) => {
    setGroupUsers((prevState) => {
      if (prevState.some((item) => JSON.stringify(item) === JSON.stringify(obj))) {
        return prevState.filter((item) => {
          if (JSON.stringify(item) !== JSON.stringify(obj)) {
            return item;
          }
        });
      } else {
        return [...prevState, obj];
      }
    });
  };

  // create group
  const createGroup = async () => {
    try {
      if (groupUsers.length >= 2) {
        setLoading(true);
        const resp = await apiPrivate({ url: '/createGroup', method: 'POST', data: { name: groupName, avatar: avatarSelected, groupUsers: groupUsers } });
        socket.current.emit('group-created', { _id: resp._id });
        window.location.reload();
      } else {
        showNotification('Cần tối thiểu 3 người để tạo nhóm', false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal fade" id="addGroupContainer" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="AddGroupContainer" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="AddGroupContainer">
              Tạo Nhóm
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="d-flex">
              {!avatarSelected ? (
                <div className="btn btn-secondary h-50 mx-3" onClick={() => setSelectAvatarGroup((prevState) => !prevState)}>
                  <AiOutlineCamera />
                </div>
              ) : (
                <div className="btn" onClick={() => setSelectAvatarGroup((prevState) => !prevState)}>
                  <img style={{ borderRadius: '50%', width: 70 }} src={avatarSelected} alt="" />
                </div>
              )}

              <div>
                <input
                  className={clsx(style.inputNameGroup, 'form-control')}
                  name="name"
                  type="text"
                  placeholder="Nhập tên nhóm"
                  style={{ border: 'none' }}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <hr className="mt-0" />
              </div>
            </div>
            <div className="m-auto d-flex" style={{ width: '70%' }}>
              <div className="mt-2 mr-2">
                <AiOutlineSearch style={{ fontSize: 25 }} />
              </div>
              <div>
                <input
                  className={clsx(style.inputNameGroup, 'form-control')}
                  type="text"
                  placeholder="Nhập tên người cần tìm"
                  style={{ border: 'none' }}
                  onChange={(e) => dispatch(changeFilter(e.target.value))}
                />
                <hr className="mt-0" />
              </div>
            </div>
            <div className="mx-3" style={{ height: 400 }}>
              {myFriends.map((contact) => (
                <div key={contact._id} className="d-flex my-4 mx-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={() => {
                        handleAddFriends({ _id: contact._id });
                      }}
                    />
                  </div>
                  <div className="mx-3">
                    <img className={clsx(style.avatarDetail)} src={contact.avatar} alt="" />
                  </div>
                  <h5 className="mx-3 d-flex align-items-center">{contact.fullName}</h5>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>

            {loading ? (
              <div className="spinner-border text-primary" role="status"></div>
            ) : (
              <button type="button" disabled={loading} className="btn btn-primary" onClick={() => createGroup()}>
                Tạo Nhóm
              </button>
            )}
          </div>
          {selectAvatarGroup && <SettupavatarGroup setSelectAvatarGroup={setSelectAvatarGroup} avatarSelected={avatarSelected} setAvatarSelected={setAvatarSelected} />}
        </div>
      </div>
    </div>
  );
}
export default AddGroup;
