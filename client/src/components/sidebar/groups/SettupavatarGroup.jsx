import React, {useEffect, useState} from 'react';
import useApiPrivate from 'hooks/useApiPrivate';
import clsx from 'clsx';
import style from 'components/sidebar/style.module.scss';
import PropTypes from "prop-types";

/**
 * @param {function} setSelectAvatarGroup
 * @param {string} avatarSelected
 * @param {function} setAvatarSelected
 * @return {JSX.Element}
 * */
function SettupavatarGroup({ setSelectAvatarGroup, avatarSelected, setAvatarSelected }) {
  const [DefaultAvatarGroup, setDefaultAvatarGroup] = useState([]);
  const {apiPrivate} = useApiPrivate();
  useEffect(() => {
    const getDefaultAvatarGroup = async () => {
      const resp = await apiPrivate({url: '/getAllCustomAvatarGroup'});
      setDefaultAvatarGroup(resp);
    };
    getDefaultAvatarGroup();
  }, []);
  return (
    <div
      className="modal fade show"
      id="addGroupContainer"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="AddGroupContainer"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body">
            <div className="row">
              {DefaultAvatarGroup.map((image, index) => (
                <div className={clsx('col-3', 'mt-2')} key={index} onClick={() => setAvatarSelected(image.avatar)}>
                  <img className={clsx({ [style['defaultAvatarSelected']]: avatarSelected === image }, 'w-100')} style={{ borderRadius: '50%' }} src={image.avatar} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectAvatarGroup(false);
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSelectAvatarGroup(false);
              }}
            >
              Chọn ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SettupavatarGroup.prototype = {
  setSelectAvatarGroup: PropTypes.func,
  avatarSelected: PropTypes.string,
  setAvatarSelected: PropTypes.func
}
export default SettupavatarGroup;
